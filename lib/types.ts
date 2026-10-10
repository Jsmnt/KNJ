export type Status = "queue" | "done";

export type Submission = {
  id: string;
  name: string;
  url: string;
  status: Status;
  createdAt: string; // ISO date, when it joined the queue
  checkedAt?: string; // ISO date, when the admin ticked it
};
