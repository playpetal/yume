import { ApolloError } from "apollo-server-errors";

export const NoPermissionError: Error = new Error(
  "You don't have permission to do that."
);

export class UnauthorizedError extends ApolloError {
  isUserFacing: boolean = true;
  name = "UnauthorizedError";

  constructor() {
    super("you need to be signed in to access that.", "UNAUTHORIZED");
  }
}

export class InvalidInputError extends ApolloError {
  isUserFacing: boolean = true;
  name = "InvalidInputError";

  constructor(message: string) {
    super(message, "INVALID_INPUT");
  }
}

export class DuplicateAccountError extends ApolloError {
  isUserFacing: boolean = true;
  name = "DuplicateAccountError";

  constructor() {
    super("you already have an account.", "DUPLICATE_ACCOUNT");
  }
}

export class UsernameTakenError extends ApolloError {
  isUserFacing: boolean = true;
  name = "UsernameTakenError";

  constructor() {
    super("that username has already been taken.", "USERNAME_TAKEN");
  }
}

export class NotFoundError extends ApolloError {
  isUserFacing = true;
  name = "NotFoundError";

  constructor(message: string) {
    super(message, "NOT_FOUND");
  }
}

export class AuthenticationError extends ApolloError {
  isUserFacing = true;
  name = "AuthenticationError";

  constructor(message: string) {
    super(message, "NOT_AUTHENTICATED");
  }
}

export class AuthorizationError extends ApolloError {
  isUserFacing = true;
  name = "AuthorizationError";

  constructor(message: string) {
    super(message, "NOT_AUTHORIZED");
  }
}

export class ResourceMaxedError extends ApolloError {
  isUserFacing = true;
  name = "ResourceMaxedError";

  constructor(message: string) {
    super(message, "RESOURCE_MAXED");
  }
}

export class MissingResourceError extends ApolloError {
  isUserFacing = true;
  name = "MissingResourceError";

  constructor(message: string) {
    super(message, "MISSING_RESOURCE");
  }
}
