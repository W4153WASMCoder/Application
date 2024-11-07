export interface UserModel {
    UserID: number | null;
    sub: string; // Unique identifier from the OpenID provider
    email: string;
    name: string;
    picture: string;
    lastLogin: Date;
}

export interface ActiveToken {
    TokenID: number | null;
    UserID: number;
    TTL: number;
    CreationDate: Date;
}
export interface Project {
    ProjectID: number;
    OwningUserID: number;
    ProjectName: string;
    CreationDate: string;
}
export interface ProjectWithLinks {
    project: Project;
    links: {
        self: string;
        update: string;
        delete: string;
        open: string;
    };
}

export interface PaginationLinks {
    self: string;
    first: string;
    last: string;
    prev?: string;
    next?: string;
}
export interface ProjectFile {
    FileID: number | null;
    projectID: number;
    parentDirectory: number | null;
    fileName: string;
    isDirectory: boolean;
    creationDate: Date;
}
export interface ProjectFileStructure {
    file: ProjectFile;
    //key is file name
    children: Map<string, ProjectFileStructure | ProjectFile>;
}
