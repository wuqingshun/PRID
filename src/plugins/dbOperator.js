import initSqlJs from "sql.js";
// Required to let webpack 4 know it needs to copy the wasm file to our assets
import sqlWasm from "!!url-loader?name=sql-wasm-[contenthash].wasm!sql.js/dist/sql-wasm.wasm";

/* var select_driver_stmt = null;
var insert_driver_stmt = null;
var select_passenger_stmt = null;
var insert_passenger_stmt = null;
var select_match_stmt = null;
var list_match_stmt = null;
var insert_match_stmt = null;
var insert_order_stmt = null; */
var select_passenger_order_stmt = null;

async function loadDB() {
    try {
        const sqlPromise = initSqlJs({
            locateFile: () => sqlWasm,
        });
        // const dataPromise = fetch("./order_task.sqlite").then((res) =>
        //   res.arrayBuffer()
        // );
        // "http://127.0.0.1:5500/public/order_task.sqlite"
        const dataPromise = fetch(
            "http://127.0.0.1:5500/public/order_task.sqlite"
        ).then((res) => res.arrayBuffer());
        const [SQL, buf] = await Promise.all([sqlPromise, dataPromise]);
        const db = new SQL.Database(new Uint8Array(buf));
        /*    db.run(
          `
                CREATE TABLE drivers (
                    id INTEGER PRIMARY KEY,
                    name TEXT NOT NULL,
                    avatar TEXT NOT NULL,
                    origin_lng REAL NOT NULL,
                    origin_lat REAL NOT NULL,
                    dist_lng REAL NOT NULL,
                    dist_lat REAL NOT NULL
                );
                CREATE TABLE passengers (
                    id INTEGER PRIMARY KEY,
                    name TEXT NOT NULL,
                    avatar TEXT NOT NULL,
                    pick_up_lng REAL NOT NULL,
                    pick_up_lat REAL NOT NULL,
                    pick_off_lng REAL NOT NULL,
                    pick_off_lat REAL NOT NULL
                );
                CREATE TABLE matches (
                    d_id INTEGER NOT NULL,
                    d_name TEXT NOT NULL,
                    d_avatar TEXT NOT NULL,
                    origin_lng REAL NOT NULL,
                    origin_lat REAL NOT NULL,
                    dist_lng REAL NOT NULL,
                    dist_lat REAL NOT NULL,
                    p_id INTEGER NOT NULL,
                    p_name TEXT NOT NULL,
                    p_avatar TEXT NOT NULL,
                    pick_up_lng REAL NOT NULL,
                    pick_up_lat REAL NOT NULL,
                    pick_off_lng REAL NOT NULL,
                    pick_off_lat REAL NOT NULL,
                    score REAL NOT NULL,
                    timestamp INTEGER NOT NULL,
                    PRIMARY KEY (d_id, p_id)
                );
                CREATE TABLE orders (
                    d_id INTEGER NOT NULL,
                    d_name TEXT NOT NULL,
                    d_avatar TEXT NOT NULL,
                    origin_lng REAL NOT NULL,
                    origin_lat REAL NOT NULL,
                    dist_lng REAL NOT NULL,
                    dist_lat REAL NOT NULL,
                    p_id INTEGER NOT NULL,
                    p_name TEXT NOT NULL,
                    p_avatar TEXT NOT NULL,
                    pick_up_lng REAL NOT NULL,
                    pick_up_lat REAL NOT NULL,
                    pick_off_lng REAL NOT NULL,
                    pick_off_lat REAL NOT NULL,
                    score REAL NOT NULL,
                    timestamp INTEGER NOT NULL,
                    PRIMARY KEY (d_id, p_id)
                 );
                 CREATE TRIGGER order_trigger
                 AFTER INSERT ON orders FOR EACH ROW
                 BEGIN
                    DELETE FROM drivers WHERE drivers.id = NEW.d_id;
                    DELETE FROM passengers WHERE passengers.id = NEW.p_id;
                    DELETE FROM matches WHERE matches.d_id = NEW.d_id OR matches.p_id = NEW.p_id;
                 END;
                `
        ); */
        return db;
    } catch (err) {
        console.error(err);
    }
}

export function initDB() {
    loadDB().then((db) => {
        /*     select_driver_stmt = db.prepare(`SELECT * FROM drivers WHERE id=?`);
        insert_driver_stmt = db.prepare(
          `INSERT INTO drivers(id,name,avatar,origin_lng,origin_lat,dist_lng,dist_lat) VALUES(?,?,?,?,?,?,?)`
        );
        select_passenger_stmt = db.prepare(`SELECT * FROM passengers WHERE id=?`);
        insert_passenger_stmt = db.prepare(
          `INSERT INTO passengers(id,name,avatar,pick_up_lng,pick_up_lat,pick_off_lng,pick_off_lat) VALUES(?,?,?,?,?,?,?)`
        );
        select_match_stmt = db.prepare(
          `SELECT * FROM matches WHERE d_id=? AND p_id=?`
        );
        list_match_stmt = db.prepare(`SELECT * FROM matches`);
        insert_match_stmt = db.prepare(`INSERT INTO matches
            (d_id,d_name,d_avatar,origin_lng,origin_lat,dist_lng,dist_lat,p_id,p_name,p_avatar,pick_up_lng,pick_up_lat,pick_off_lng,pick_off_lat,score,timestamp)
            VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`);
        insert_order_stmt = db.prepare(`INSERT INTO orders
            (d_id,d_name,d_avatar,origin_lng,origin_lat,dist_lng,dist_lat,p_id,p_name,p_avatar,pick_up_lng,pick_up_lat,pick_off_lng,pick_off_lat,score,timestamp)
            VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`); */
        select_passenger_order_stmt = db.prepare(
            `SELECT * FROM order_task_CD_1_0_24 WHERE start_timestamp BETWEEN ? AND ? LIMIT ?`
        );
    });
}

export function selectPassengerOrder(timeFrom, timeTo) {
    select_passenger_order_stmt.bind([
        timeFrom,
        timeTo,
        Math.floor(20 + Math.random() * 100),
    ]);
    let res = [];
    while (select_passenger_order_stmt.step())
        res.push(select_passenger_order_stmt.getAsObject());
    select_passenger_order_stmt.reset();
    return res;
}

/* export function selectDriver(id) {
  let res = select_driver_stmt.getAsObject([id]);
  select_driver_stmt.reset();
  return res;
}

export function insertDriver(params) {
  try {
    insert_driver_stmt.run(params);
  } catch (err) {
    console.error(err);
  }
}

export function selectPassenger(id) {
  let res = select_passenger_stmt.getAsObject([id]);
  select_passenger_stmt.reset();
  return res;
}

export function insertPassenger(params) {
  try {
    insert_passenger_stmt.run(params);
  } catch (err) {
    console.error(err);
  }
}

export function selectMatch(params) {
  let res = select_match_stmt.get(params);
  select_match_stmt.reset();
  return res;
}

export function listMatch() {
  return list_match_stmt;
}

export function insertMatch(params) {
  try {
    insert_match_stmt.run(params);
  } catch (err) {
    console.error(err);
  }
}

export function insertOrder(params) {
  try {
    insert_order_stmt.run(params);
  } catch (err) {
    console.error(err);
    console.log(params);
  }
} */