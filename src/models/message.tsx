type MetaData = {
  course_id: string;
  file_id: string;
  start_page: number;
  up_to_page: number;
  retrieval_score: number;
  filename: string;
};

type Node = {
  id: string;
  content: string;
  metadata: MetaData;
  relations: unknown;
  similarity_score?: number;
};

type Message = {
  role: string;
  content: string;
  timestamp: number;
  nodes?: Node[];
};

export type { Message, Node, MetaData };
