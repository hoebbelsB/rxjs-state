import { isObservable, Observable, OperatorFunction } from 'rxjs';

export type potentialObservableValue<T> =
  | Promise<T>
  | Observable<T>
  | undefined
  | null;

export type remainHigherOrder<T> = (
  o$$: Observable<Observable<T>>
) => Observable<Observable<T>>;

export function isUndefinedOrNullGuard<T>(
  potentialObservableValue: unknown
): potentialObservableValue is undefined | null {
  return (
    potentialObservableValue === null || potentialObservableValue === undefined
  );
}

export function isPromiseGuard<T>(value: unknown): value is Promise<T> {
  return (
    !!value &&
    typeof (<any>value).subscribe !== 'function' &&
    typeof (value as any).then === 'function'
  );
}

export function isObservableGuard<T>(
  potentialObservableValue: unknown
): potentialObservableValue is Observable<T> {
  return isObservable(potentialObservableValue);
}

export function isOperateFnArrayGuard<T>(
  op: any[]
): op is OperatorFunction<T, any>[] {
  return op.length > 0 && op.every((i: any) => typeof i !== 'string');
}

export function isStringArrayGuard(op: any[]): op is string[] {
  return op.length > 0 && op.every((i: any) => typeof i === 'string');
}

export function isDefinedGuard<T>(opr: T | undefined): opr is T {
  return opr !== undefined;
}

export function isIterableGuard<T>(obj: unknown): obj is Array<T> {
  if (isUndefinedOrNullGuard(obj)) {
    return false;
  }
  return typeof (obj as any)[Symbol.iterator] === 'function';
}
