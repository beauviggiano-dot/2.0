module.exports = [
"[project]/node_modules/.pnpm/@better-auth+kysely-adapter@1.6.23_@better-auth+core@1.6.23_@better-auth+utils@0.4.2_@b_ba20323618942fec6c9532f1b71fdd54/node_modules/@better-auth/kysely-adapter/dist/kysely-migration-tables-JkVUjPF_.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "n",
    ()=>DEFAULT_MIGRATION_TABLE,
    "t",
    ()=>DEFAULT_MIGRATION_LOCK_TABLE
]);
//#region src/kysely-migration-tables.ts
/**
* Kysely's internal migration table names, mirrored as local constants.
*
* Kysely 0.29 moved these from its main entry to the `kysely/migration`
* subpath (which 0.28 lacks), and the main entry now exports only type stubs
* with no runtime value, which breaks strict ESM bundlers such as Turbopack.
* The values are a stable part of Kysely's public migration contract, so
* mirroring them lets the SQLite dialects run on both Kysely 0.28 and 0.29
* without importing from a moving path.
* TODO: Revisit this mirror if Better Auth drops Kysely 0.28 support and can
* depend on Kysely's `kysely/migration` export.
*
* @see https://github.com/better-auth/better-auth/issues/9810
*/ const DEFAULT_MIGRATION_TABLE = "kysely_migration";
const DEFAULT_MIGRATION_LOCK_TABLE = "kysely_migration_lock";
;
}),
"[project]/node_modules/.pnpm/@better-auth+kysely-adapter@1.6.23_@better-auth+core@1.6.23_@better-auth+utils@0.4.2_@b_ba20323618942fec6c9532f1b71fdd54/node_modules/@better-auth/kysely-adapter/dist/node-sqlite-dialect.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "NodeSqliteDialect",
    ()=>NodeSqliteDialect
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$kysely$2d$adapter$40$1$2e$6$2e$23_$40$better$2d$auth$2b$core$40$1$2e$6$2e$23_$40$better$2d$auth$2b$utils$40$0$2e$4$2e$2_$40$b_ba20323618942fec6c9532f1b71fdd54$2f$node_modules$2f40$better$2d$auth$2f$kysely$2d$adapter$2f$dist$2f$kysely$2d$migration$2d$tables$2d$JkVUjPF_$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@better-auth+kysely-adapter@1.6.23_@better-auth+core@1.6.23_@better-auth+utils@0.4.2_@b_ba20323618942fec6c9532f1b71fdd54/node_modules/@better-auth/kysely-adapter/dist/kysely-migration-tables-JkVUjPF_.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$kysely$40$0$2e$29$2e$3$2f$node_modules$2f$kysely$2f$dist$2f$query$2d$compiler$2f$compiled$2d$query$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/kysely@0.29.3/node_modules/kysely/dist/query-compiler/compiled-query.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$kysely$40$0$2e$29$2e$3$2f$node_modules$2f$kysely$2f$dist$2f$query$2d$compiler$2f$default$2d$query$2d$compiler$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/kysely@0.29.3/node_modules/kysely/dist/query-compiler/default-query-compiler.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$kysely$40$0$2e$29$2e$3$2f$node_modules$2f$kysely$2f$dist$2f$raw$2d$builder$2f$sql$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/kysely@0.29.3/node_modules/kysely/dist/raw-builder/sql.js [app-route] (ecmascript)");
;
;
//#region src/node-sqlite-dialect.ts
var NodeSqliteAdapter = class {
    get supportsCreateIfNotExists() {
        return true;
    }
    get supportsTransactionalDdl() {
        return false;
    }
    get supportsMultipleConnections() {
        return false;
    }
    get supportsReturning() {
        return true;
    }
    async acquireMigrationLock() {}
    async releaseMigrationLock() {}
    get supportsOutput() {
        return true;
    }
};
var NodeSqliteDriver = class {
    #config;
    #connectionMutex = new ConnectionMutex();
    #db;
    #connection;
    constructor(config){
        this.#config = {
            ...config
        };
    }
    async init() {
        this.#db = this.#config.database;
        this.#connection = new NodeSqliteConnection(this.#db);
        if (this.#config.onCreateConnection) await this.#config.onCreateConnection(this.#connection);
    }
    async acquireConnection() {
        await this.#connectionMutex.lock();
        return this.#connection;
    }
    async beginTransaction(connection) {
        await connection.executeQuery(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$kysely$40$0$2e$29$2e$3$2f$node_modules$2f$kysely$2f$dist$2f$query$2d$compiler$2f$compiled$2d$query$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["CompiledQuery"].raw("begin"));
    }
    async commitTransaction(connection) {
        await connection.executeQuery(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$kysely$40$0$2e$29$2e$3$2f$node_modules$2f$kysely$2f$dist$2f$query$2d$compiler$2f$compiled$2d$query$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["CompiledQuery"].raw("commit"));
    }
    async rollbackTransaction(connection) {
        await connection.executeQuery(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$kysely$40$0$2e$29$2e$3$2f$node_modules$2f$kysely$2f$dist$2f$query$2d$compiler$2f$compiled$2d$query$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["CompiledQuery"].raw("rollback"));
    }
    async releaseConnection() {
        this.#connectionMutex.unlock();
    }
    async destroy() {
        this.#db?.close();
    }
};
var NodeSqliteConnection = class {
    #db;
    constructor(db){
        this.#db = db;
    }
    executeQuery(compiledQuery) {
        const { sql, parameters } = compiledQuery;
        const stmt = this.#db.prepare(sql);
        const params = parameters;
        if (stmt.columns().length > 0) return Promise.resolve({
            rows: stmt.all(...params)
        });
        const { changes, lastInsertRowid } = stmt.run(...params);
        return Promise.resolve({
            rows: [],
            numAffectedRows: BigInt(changes),
            insertId: typeof lastInsertRowid === "bigint" ? lastInsertRowid : BigInt(lastInsertRowid)
        });
    }
    async *streamQuery() {
        throw new Error("Streaming query is not supported by SQLite driver.");
    }
};
var ConnectionMutex = class {
    #promise;
    #resolve;
    async lock() {
        while(this.#promise !== void 0)await this.#promise;
        this.#promise = new Promise((resolve)=>{
            this.#resolve = resolve;
        });
    }
    unlock() {
        const resolve = this.#resolve;
        this.#promise = void 0;
        this.#resolve = void 0;
        resolve?.();
    }
};
var NodeSqliteIntrospector = class {
    #db;
    constructor(db){
        this.#db = db;
    }
    async getSchemas() {
        return [];
    }
    async getTables(options = {
        withInternalKyselyTables: false
    }) {
        let query = this.#db.selectFrom("sqlite_schema").where("type", "=", "table").where("name", "not like", "sqlite_%").select("name").$castTo();
        if (!options.withInternalKyselyTables) query = query.where("name", "!=", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$kysely$2d$adapter$40$1$2e$6$2e$23_$40$better$2d$auth$2b$core$40$1$2e$6$2e$23_$40$better$2d$auth$2b$utils$40$0$2e$4$2e$2_$40$b_ba20323618942fec6c9532f1b71fdd54$2f$node_modules$2f40$better$2d$auth$2f$kysely$2d$adapter$2f$dist$2f$kysely$2d$migration$2d$tables$2d$JkVUjPF_$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["n"]).where("name", "!=", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$kysely$2d$adapter$40$1$2e$6$2e$23_$40$better$2d$auth$2b$core$40$1$2e$6$2e$23_$40$better$2d$auth$2b$utils$40$0$2e$4$2e$2_$40$b_ba20323618942fec6c9532f1b71fdd54$2f$node_modules$2f40$better$2d$auth$2f$kysely$2d$adapter$2f$dist$2f$kysely$2d$migration$2d$tables$2d$JkVUjPF_$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["t"]);
        const tables = await query.execute();
        return Promise.all(tables.map(({ name })=>this.#getTableMetadata(name)));
    }
    async #getTableMetadata(table) {
        const db = this.#db;
        const autoIncrementCol = (await db.selectFrom("sqlite_master").where("name", "=", table).select("sql").$castTo().execute())[0]?.sql?.split(/[\(\),]/)?.find((it)=>it.toLowerCase().includes("autoincrement"))?.split(/\s+/)?.[0]?.replace(/["`]/g, "");
        return {
            name: table,
            columns: (await db.selectFrom(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$kysely$40$0$2e$29$2e$3$2f$node_modules$2f$kysely$2f$dist$2f$raw$2d$builder$2f$sql$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`pragma_table_info(${table})`.as("table_info")).select([
                "name",
                "type",
                "notnull",
                "dflt_value"
            ]).execute()).map((col)=>({
                    name: col.name,
                    dataType: col.type,
                    isNullable: !col.notnull,
                    isAutoIncrementing: col.name === autoIncrementCol,
                    hasDefaultValue: col.dflt_value != null
                })),
            isView: false,
            isForeign: false
        };
    }
};
var NodeSqliteQueryCompiler = class extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$kysely$40$0$2e$29$2e$3$2f$node_modules$2f$kysely$2f$dist$2f$query$2d$compiler$2f$default$2d$query$2d$compiler$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DefaultQueryCompiler"] {
    getCurrentParameterPlaceholder() {
        return "?";
    }
    getLeftIdentifierWrapper() {
        return "\"";
    }
    getRightIdentifierWrapper() {
        return "\"";
    }
    getAutoIncrement() {
        return "autoincrement";
    }
};
var NodeSqliteDialect = class {
    #config;
    constructor(config){
        this.#config = {
            ...config
        };
    }
    createDriver() {
        return new NodeSqliteDriver(this.#config);
    }
    createQueryCompiler() {
        return new NodeSqliteQueryCompiler();
    }
    createAdapter() {
        return new NodeSqliteAdapter();
    }
    createIntrospector(db) {
        return new NodeSqliteIntrospector(db);
    }
};
;
}),
];

//# sourceMappingURL=0bgo_%40better-auth_kysely-adapter_dist_0y~hrfj._.js.map