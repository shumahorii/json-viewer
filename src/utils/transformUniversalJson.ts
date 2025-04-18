import { Edge, MarkerType } from "reactflow";

/**
 * 文字列の先頭を大文字に変換するユーティリティ関数
 * 例: "user" → "User"
 */
const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

/**
 * 任意のJSONオブジェクトを再帰的に探索し、
 * ネストされた構造を「クラス」として抽出する関数。
 * 各クラスは `name`（クラス名）と `properties`（プロパティの型情報）を持つ。
 *
 * @param obj 対象のJSONオブジェクト
 * @param name このオブジェクトのクラス名（デフォルトは "Root"）
 * @param seen 再帰の無限ループを防ぐためのWeakSet（循環参照対策）
 * @returns クラス定義の配列
 */
export const extractClasses = (
    obj: any,
    name = "Root",
    seen = new WeakSet()
): { name: string; properties: string[] }[] => {
    // 対象がオブジェクトでなければスキップ
    if (obj === null || typeof obj !== "object" || seen.has(obj)) return [];
    seen.add(obj);

    const props: string[] = []; // このクラスのプロパティ一覧
    const nestedClasses: any[] = []; // ネストされたクラスたち

    // オブジェクトの各キーを処理
    for (const key of Object.keys(obj)) {
        const value = obj[key];

        if (Array.isArray(value)) {
            // 配列の場合：中身がオブジェクトならクラスにする、それ以外は型名をそのまま
            if (value.length > 0 && typeof value[0] === "object") {
                const className = capitalize(key);
                props.push(`${key}: ${className}[]`);
                nestedClasses.push(...extractClasses(value[0], className, seen));
            } else {
                props.push(`${key}: ${typeof value[0] || "any"}[]`);
            }
        } else if (typeof value === "object" && value !== null) {
            // オブジェクト型 → 別クラスとして扱う
            const className = capitalize(key);
            props.push(`${key}: ${className}`);
            nestedClasses.push(...extractClasses(value, className, seen));
        } else {
            // プリミティブ型（string, number, booleanなど）
            props.push(`${key}: ${typeof value}`);
        }
    }

    // 自分自身 + ネストされたクラスをまとめて返す
    return [{ name, properties: props }, ...nestedClasses];
};

/**
 * JSONをクラス一覧だけに変換するバージョン。
 * 矢印線（edges）は含まない。
 */
export const transformUniversalJson = (raw: any): { classes: any[] } => {
    const rootKey = Array.isArray(raw) ? "RootArray" : "Root";
    return {
        classes: extractClasses(raw, rootKey)
    };
};

/**
 * JSONを「クラス一覧」と「クラス間の関係線（edges）」に変換する関数。
 * 関係線はプロパティの型に別クラス名が含まれているかどうかで判定する。
 */
export const transformUniversalJsonWithEdges = (raw: any): { classes: any[], edges: Edge[] } => {
    // クラス名 → プロパティ一覧のMap（後でedge構築に使う）
    const classMap = new Map<string, string[]>();

    // クラスを抽出しながらMapに登録
    const classes = extractClasses(raw, 'Root').map(cls => {
        classMap.set(cls.name, cls.properties);
        return cls;
    });

    // クラス間の関係線（参照）を構築
    const edges: Edge[] = [];

    for (const [from, props] of classMap.entries()) {
        props.forEach(prop => {
            // 型名に別クラス（大文字始まり）を使っているものを抽出
            const match = prop.match(/: ([A-Z][a-zA-Z0-9]*)\[]?/);
            if (match) {
                const to = match[1]; // 参照先クラス名

                edges.push({
                    id: `e-${from}-${to}`, // エッジの一意なID
                    source: from,          // 矢印の始点クラス
                    target: to,            // 矢印の終点クラス
                    type: 'smoothstep',    // 線のスタイル
                    markerEnd: { type: MarkerType.ArrowClosed } // 矢印の形
                });
            }
        });
    }

    return { classes, edges };
};