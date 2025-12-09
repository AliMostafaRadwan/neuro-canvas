import { type User, type InsertUser, type SerializedGraph, type VersionSnapshot } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  saveGraph(id: string, graph: SerializedGraph): Promise<void>;
  getGraph(id: string): Promise<SerializedGraph | undefined>;
  saveSnapshot(graphId: string, snapshot: VersionSnapshot): Promise<void>;
  getSnapshots(graphId: string): Promise<VersionSnapshot[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private graphs: Map<string, SerializedGraph>;
  private snapshots: Map<string, VersionSnapshot[]>;

  constructor() {
    this.users = new Map();
    this.graphs = new Map();
    this.snapshots = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async saveGraph(id: string, graph: SerializedGraph): Promise<void> {
    this.graphs.set(id, graph);
  }

  async getGraph(id: string): Promise<SerializedGraph | undefined> {
    return this.graphs.get(id);
  }

  async saveSnapshot(graphId: string, snapshot: VersionSnapshot): Promise<void> {
    const existing = this.snapshots.get(graphId) || [];
    existing.push(snapshot);
    this.snapshots.set(graphId, existing);
  }

  async getSnapshots(graphId: string): Promise<VersionSnapshot[]> {
    return this.snapshots.get(graphId) || [];
  }
}

export const storage = new MemStorage();
