type Settings = {
    male: string;
    female: string;
};
type BasicOptions = {
    sex: "male" | "female";
};
export declare const sex: import("../extension.js").Extension<Settings, BasicOptions>;
export {};
