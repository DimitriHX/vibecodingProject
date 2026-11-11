export interface IdGenerator {
  next(): string;
}

export const uuidGenerator: IdGenerator = {
  next: () => crypto.randomUUID(),
};
