export type StaffRole = "owner" | "assistant";

export type StaffProfile = {
  id: string;
  email: string;
  fullName: string | null;
  role: StaffRole;
};

export function assertNever(value: never): never {
  throw new Error(`Unhandled value: ${String(value)}`);
}

export function canDeleteProperties(role: StaffRole): boolean {
  switch (role) {
    case "owner":
      return true;
    case "assistant":
      return false;
    default:
      return assertNever(role);
  }
}

export function canManageStaff(role: StaffRole): boolean {
  switch (role) {
    case "owner":
      return true;
    case "assistant":
      return false;
    default:
      return assertNever(role);
  }
}
