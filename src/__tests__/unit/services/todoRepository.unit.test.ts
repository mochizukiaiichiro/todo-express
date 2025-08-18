import isTodoRow from "../../../api/services/isTodoRow";
import { createTodoDbService } from "../../../api/services/createTodoDbService";
import { Todo, TodoRepository } from "../../../types/types";

describe("todoDbService", () => {
  let dbs: TodoRepository;

  beforeEach(() => {
    dbs = createTodoDbService(); // インメモリDB
  });

  afterEach(() => {
    dbs.close();
  });

  describe("insert, getAll（ToDo登録・取得機能の仕様）", () => {
    /**
     * 正常系：新規ToDoを1件追加した場合
     * - 初期状態では空配列を返す
     * - insert()した内容が正しく登録される
     * - completed フラグは初期値 false
     */
    test("insertしたTodoの値が正しい。", () => {
      // --- 前提 ---
      expect(dbs.getAll()).toEqual([]); // 初期状態は空配列

      // --- 実行 ---
      const todoName = "test";
      const { id } = dbs.insert(todoName); // ToDoを１件追加
      const todos = dbs.getAll(); // ToDoの取得

      // --- 検証 ---
      expect(todos).toEqual([
        expect.objectContaining({
          id,
          todoName,
          completed: false,
        }),
      ]);
    });

    /**
     * 正常系：insertで登録したToDoは型定義通りのプロパティを持つ
     * - id: string
     * - todoName: string
     * - completed: boolean
     * - created_at: number (UNIXタイムスタンプ等)
     */
    test("insertしたTodoの型が正しい", () => {
      // --- 前提 ---
      expect(dbs.getAll()).toEqual([]); // 初期状態は空配列

      // --- 実行 ---
      const todoName = "test";
      dbs.insert(todoName); // ToDoを１件追加
      const todos = dbs.getAll(); // ToDoの取得

      // --- 検証 ---
      todos.forEach((todo) => {
        expect(typeof todo.id).toBe("string");
        expect(typeof todo.todoName).toBe("string");
        expect(typeof todo.completed).toBe("boolean");
        expect(typeof todo.created_at).toBe("number");
      });
    });

    /**
     * 正常系：複数件のToDoを追加した場合
     * - getAll()で全件取得できる
     * - 順序は問わない
     * - 各ToDoのcompletedはfalseで初期化される
     */
    test("insertで追加した複数のTodoの取得できる。", () => {
      // --- 前提 ---
      expect(dbs.getAll()).toEqual([]); // 初期状態は空配列

      // --- 実行 ---
      const testData = ["test1", "test2"]; // ToDoを２件追加
      const expectedTodos = testData.map((t) => {
        return { id: dbs.insert(t).id, todoName: t };
      });

      // ToDoの取得
      const todos = dbs.getAll();

      // --- 検証 ---
      // 件数チェック
      expect(todos).toHaveLength(testData.length);

      // 順序に依存しない部分一致(created_atはチェックしない)
      expect(todos).toEqual(
        expect.arrayContaining(
          expectedTodos.map((t) =>
            expect.objectContaining({ ...t, completed: false })
          )
        )
      );
    });
  });

  describe("delete (削除機能)", () => {
    /**
     * 正常系：既存のTodoを削除した場合
     * - 変更件数が1件であること
     * - 削除後にgetAll()で該当Todoが取得できないこと
     */
    test("既存のTodoを削除し、リストが空になることを確認する", () => {
      // --- 実行 ---
      const { id } = dbs.insert("test1"); // ToDoを１件追加
      const changes = dbs.remove(id); // Todoを削除

      // --- 検証 ---
      expect(changes).toBe(1);
      expect(dbs.getAll()).toEqual([]); // 空配列になっていることを確認
    });

    /**
     * 正常系：複数件存在する場合に特定IDのみ削除する
     * - 他のレコードは保持されること
     */
    test("複数Todoのうち指定IDのみ削除される", () => {
      // --- 実行 ---
      const { id: id1 } = dbs.insert("test1");
      const { id: id2 } = dbs.insert("test2");
      dbs.remove(id1);

      // --- 検証 ---
      expect(dbs.getAll()).toEqual([
        expect.objectContaining({ id: id2, todoName: "test2" }),
      ]);
    });

    /**
     * 異常系：存在しないIDを削除する
     * - 変更件数が0であること
     * - 他データに影響がないこと
     */
    test("存在しないIDを削除しても何も変更されない", () => {
      // --- 前提 ---
      const before = dbs.getAll();

      // --- 実行 ---
      const changes = dbs.remove("non-existent-id"); // Todoを削除

      // --- 検証 ---
      expect(changes).toBe(0);
      expect(dbs.getAll()).toEqual(before);
    });
  });

  describe("update（completedの反転機能）", () => {
    /**
     * 正常系：Todoの completed を反転できる場合
     * - 初期状態では completed が false
     * - update() 実行後に completed が true へ変わる
     * - 戻り値の変更件数が 1 である
     */
    test("Todoのcompletedが反転する", () => {
      // --- 前提 ---
      dbs.insert("test"); // ToDoを１件追加
      const todo = dbs.getAll()[0]!; // Todoを取得
      expect(todo.completed).toBe(false); // 初期値確認

      // --- 実行 ---
      const changes = dbs.update(todo);
      expect(changes).toBe(1);

      // --- 検証 ---
      const updatedTodo = dbs.getAll()[0]!; // 更新データを取得
      expect(updatedTodo.completed).toBe(true);
    });

    /**
     * 正常系：completed を2回反転した場合
     * - 初期状態では completed が false
     * - 1回目の update() で true になる
     * - 2回目の update() で false に戻る
     */
    test("completedを2回反転すると元に戻る", () => {
      // --- 前提 ---
      dbs.insert("test"); // ToDoを１件追加
      const todo = dbs.getAll()[0]!; // Todoを取得
      expect(todo.completed).toBe(false); // 初期値確認

      // --- 実行 ---
      dbs.update(todo); // false → true
      dbs.update(dbs.getAll()[0]!); // true → false

      // --- 検証 ---
      const final = dbs.getAll()[0]!; // 更新データを取得
      expect(final.completed).toBe(todo.completed);
    });

    /**
     * 異常系：存在しない ID を更新した場合
     * - 変更件数は 0 である
     */
    test("存在しないIDを更新しても変更件数は0", () => {
      // --- 前提 ---
      const dummyTodo: Todo = {
        id: "no-such-id",
        todoName: "x",
        completed: false,
        created_at: 1,
      };

      // --- 実行 ---
      const changes = dbs.update(dummyTodo);

      // --- 検証 ---
      expect(changes).toBe(0);
    });
  });

  describe("getCompleted（指定した completed 状態の Todo を取得）", () => {
    /**
     * 正常系: completed=false の Todo が取得される
     * - 未完了Todoのみ返却する
     */
    test("completed=false の Todo のみ取得できる", () => {
      // --- 前提 ---
      expect(dbs.getAll()).toEqual([]); // 初期状態は空配列

      // --- 実行 ---
      const todoName = "test";
      const { id } = dbs.insert(todoName); // ToDoを１件追加
      const todos = dbs.getCompleted(false);

      // --- 検証 ---
      expect(todos).toHaveLength(1);

      expect(todos).toEqual([
        expect.objectContaining({ id, todoName, completed: false }),
      ]);
    });

    /**
     * 正常系: completed=true の Todo が取得される
     * - 事前に Todo の completed を true に変更しておく
     */
    test("completed=true の Todo のみ取得できる", () => {
      // --- 前提 ---
      expect(dbs.getAll()).toEqual([]); // 初期状態は空配列

      // --- 実行 ---
      const todoName = "test";
      const { id } = dbs.insert("test");
      const todo = dbs.getAll()[0]!;
      dbs.update(todo); // completed: false → true

      // --- 検証 ---
      const todos = dbs.getCompleted(true);
      expect(todos).toEqual([
        expect.objectContaining({ id, todoName, completed: true }),
      ]);
    });

    /**
     * 正常系: 指定した completed 状態の Todo が存在しない場合は空配列
     */
    test("指定状態の Todo が存在しなければ空配列を返す", () => {
      // --- 前提 ---
      expect(dbs.getAll()).toEqual([]);

      // --- 実行 ---
      const todoName = "test";
      dbs.insert(todoName);
      const todos = dbs.getCompleted(true);

      // --- 検証 ---
      expect(todos).toEqual([]);
    });
  });

  describe("getId（ToDo登録・指定したIdのTodoの取得）", () => {
    test("指定したIdのTodoの取得できる", () => {
      // --- 前提 ---
      expect(dbs.getAll()).toEqual([]); // 初期状態は空配列

      // --- 実行 ---
      const todoName = "test";
      const { id } = dbs.insert(todoName); // ToDoを１件追加
      const todo = dbs.getId(id); // ToDoの取得

      // --- 検証 ---
      expect(isTodoRow(todo)).toBe(true); //型ガードでTodo型が返却されることを検証
      expect(todo).toMatchObject({ id, todoName, completed: false });
    });

    /**
     * 正常系: 指定したidのTodo が存在しない場合はundefined
     */
    test("指定したidのTodo が存在しなければundefinedを返す", () => {
      // --- 前提 ---
      expect(dbs.getAll()).toEqual([]);

      // --- 実行 ---
      const todo = dbs.getId("non-existent-id");

      // --- 検証 ---
      expect(todo).toBeUndefined();
    });
  });
});
