// This is a recursive type that converts all nullable values in a type to non-nullable values.
// It will also convert any nested nullable values to non-nullable values.
// For example, WithoutNullableValues<{ foo: number | null | undefined }> will evaluate to { foo: number }

export type WithoutNullableValues<Type> = {
  [Key in keyof Type]: WithoutNullableValues<NonNullable<Type[Key]>>;
};
