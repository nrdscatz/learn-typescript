/**
 * 기본 타입
 */
let name: string = "kim";
let age: number = 20;
let ok: boolean = true;
let nums: number[] = [1, 2, 3]; // 또는 Array<number>
let tuple: [string, number] = ["a", 1]; // 길이·위치별 타입 고정
let u: undefined = undefined;
let n: null = null;
let big: bigint = 10n;
let sym: symbol = Symbol();

/**
 * 특수 타입은 아래처럼 구분된다.
 *
 * - any: 타입 검사를 포기한다. 쓰지 않는 게 원칙이다.
 * - unknown: 안전한 any이다. 쓰려면 먼저 타입을 좁혀야 한다.
 * - void: 반환값이 없는 함수
 * - never: 절대 도달하지 않거나 값이 없는 타입(예외를 던지는 함수, 무한 루프)
 */
let x: unknown = "hi";
// x.toUpperCase();
if (typeof x === "string") x.toUpperCase(); // 타입 좁힌 뒤 사용 가능

/**
 * enum과 리터럴 타입
 */
enum Role {
  // 숫자 enum (0,1)
  Admin,
  User,
}
enum Status {
  // 문자열 enum
  Ok = "OK",
  Fail = "FAIL",
}

type Direction = "up" | "down" | "left" | "right"; // 리터럴 유니온(enum 대안)

/**
 * 타입 추론과 단언
 *
 * 초기값이 있으면 타입을 생략해도 된다. *함수 매개변수는 추론이 안 된다.
 *
 * 단언은 컴파일러는 속이는 것이라 틀리면 런타임 에러가 난다. 꼭 필요할 때만 쓰자.
 */
let a = 10;
const b = "hi";
const arr = [1, 2];

const el = document.getElementById("app") as HTMLDivElement; // 타입 단언

/**
 * !: null/undefined가 아니라고 단언(남용 금지)
 */
// const v = obj!.value;

/**
 * 함수
 */
function add(a: number, b: number): number {
  return a + b;
}

const sub = (a: number, b: number): number => a - b;

function greet(name: string, greeting?: string) {} // 선택적 매개변수
function hello(name: string, greeting = "Hello") {} // 기본값
// 나머지 매개변수
function sum(...nums: number[]): number {
  return nums.reduce((a, b) => a + b, 0);
}

type Fn = (a: number, b: number) => number; // 함수 타입
const mul: Fn = (a, b) => a * b;

/**
 * 함수 오버로드
 *
 * 함수 오버로드는 같은 함수를 여러 시그니처로 선언하는 방식이다.
 */
function parse(x: string): number;
function parse(x: number): string;
function parse(x: string | number) {
  return typeof x === "string" ? Number(x) : String(x);
}

/**
 * 객체 타입: interface vs type
 *
 * - interface: extends, 선언 병합(같은 이름으로 재선언시 합쳐짐)이 가능하다. 유니온/튜플/원시 별칭 불가능하다.
 * - type: & 인터섹션, 선언 병합이 불가능하다. 유니온/튜플/원시 별칭이 가능하다.
 */
interface User {
  readonly id: number; // 읽기 전용
  name: string;
  email?: string; // 선택적
  [key: string]: unknown; // 인덱스 시그니처 (임의 키 허용)
}

interface Admin extends User {
  level: number;
} // 상속

type Point = { x: number; y: number };

/**
 * 유니온, 인터섹션, 타입 좁히기
 */
type ID = string | number; // 유니온(A 또는 B)
type Person = { name: string } & { age: number }; // 인터섹션(A 그리고 B)

// 타입 좁히기는 유니온 타입을 안전하게 쓰는 핵심 기법이다.
function print(id: string | number) {
  if (typeof id === "string") id.toUpperCase();
  else id.toFixed(2);
}

// instanceof, in, 동등 비교, truthiness 검사도 좁히기에 쓰인다.
// if ('swim' in animal) animal.swim();

// 판별 유니온은 공통 리터럴 필드로 구분하는 패턴이고, 실무에서 매우 자주 쓰인다.
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "rect"; w: number; h: number };
function area(s: Shape) {
  switch (s.kind) {
    case "circle":
      return Math.PI * s.radius ** 2;
    case "rect":
      return s.w * s.h;
    default: {
      const _never: never = s; // 케이스를 빠뜨리면 컴파일 에러
      return _never;
    }
  }
}

// 사용자 정의 타입 가드도 있다.
function isString(x: unknown): x is string {
  return typeof x === "string";
}

/**
 * 제네릭
 *
 * 타입을 매개변수처럼 받는 기능이다.
 */
function identity<T>(x: T): T {
  return x;
}
identity<string>("a");
identity(10); // T는 number로 추론

// 제약(extends)
function len<T extends { length: number }>(x: T) {
  return x.length;
}

// 기본값
interface ApiResponse<T = unknown> {
  data: T;
  status: number;
}

// keyof와 함께
function getProp<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

/**
 * 클래스
 */
class Animal {
  readonly id: number;
  private secret = "x"; // 클래스 내부만
  protected age: number; // 자식 클래스까지
  public name: string; // 기본값

  constructor(id: number, name: string, age: number) {
    this.id = id;
    this.name = name;
    this.age = age;
  }
}

// 매개변수 프로퍼티 (축약형)
class Dog {
  constructor(
    public name: string,
    private age: number,
  ) {}
}

interface Walkable {
  walk(): void;
}
class Cat implements Walkable {
  walk() {}
} // 인터페이스 구현

abstract class Base {
  abstract run(): void;
} // 추상 클래스

// 주의: private은 컴파일 타임에만 적용되고, 진짜 런타임 private은 JS의 #field이다.

/**
 * 유틸리티 타입(매우 중요)
 */
interface Todo {
  id: number;
  title: string;
  done: boolean;
}

// Partial<Todo>; // 전부 선택적
// Required<Todo>; // 전부 필수
// Readonly<Todo>; // 전부 읽기 전용
// Pick<Todo, "id" | "title">; // 일부만 선택
// Omit<Todo, "done">; // 일부 제외
// Record<string, number>; // 키-값 객체 타입
// Exclude<"a" | "b", "a">; // "b"   (유니온에서 제거)
// Extract<"a" | "b", "a">; // "a"   (유니온에서 추출)
// NonNullable<string | null>; // string
// ReturnType<typeof fn>; // 함수 반환 타입
// Parameters<typeof fn>; // 함수 매개변수 튜플
// Awaited<Promise<string>>; // string

/**
 * 고급 타입
 */
// keyof : 키들의 유니온
type K = keyof Todo; // "id" | "title" | "done"

// typeof : 값에서 타입 추출
const config = { a: 1, b: "x" };
type Config = typeof config;

// 인덱스 접근 타입
type T = Todo["title"]; // string

// 매핑 타입
type Optional<T> = { [K in keyof T]?: T[K] };

// 조건부 타입 + infer
type Unwrap<T> = T extends Promise<infer U> ? U : T;
type A = Unwrap<Promise<number>>; // number

// 템플릿 리터럴 타입
type Event = `on${Capitalize<"click" | "hover">}`; // "onClick" | "onHover"

// satisfies : 타입을 검증하되 추론은 유지
const colors = { red: "#f00" } satisfies Record<string, string>;

/**
 * 모듈과 선언 파일
 *
 * `.d.ts`는 타입 선언만 담은 파일이다.
 * JS 라이브러리에 타입이 없으면 `npm i -D @types/라이브러리명`으로 설치한다.
 * `declare module "x"`로 직접 선언할 수도 있다.
 */
// export interface User {}
// export type ID = string;
// import type { User } from "./types"; // 타입만 import (번들에 안 남음)

/**
 * 비동기와 실무 패턴
 */
async function fetchUser(id: number): Promise<User> {
  const res = await fetch(`/api/users/${id}`);
  return (await res.json()) as User; // 응답은 런타임 검증이 아니라 단언일 뿐
}

// 타입은 런타임에서 사라지므로 외부 데이터(API 응답)는 타입을 붙여도 실제 값이 맞는지 보장되지 않는다. 그래서 실무에서는 `zod`같은 런타임 검증 라이브러리를 함께 쓴다.

// 리액트에서는 이렇게 쓴다.
// interface Props { title: string; onClick?: () => void }
// const Card = ({ title, onClick }: Props) => <div onClick={onClick}>{title}</div>;

// const [user, setUser] = useState<User | null>(null);
