type Primitive = string | number;
export interface Scheme {
    [key: PropertyKey]: Primitive | Scheme;
}
export {};
