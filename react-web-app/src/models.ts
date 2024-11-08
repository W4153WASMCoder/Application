import react from 'react'

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
    ProjectID: number;
    ParentDirectory: number | null;
    FileName: string;
    IsDirectory: boolean;
    creationDate: Date;
}
export interface ProjectFileStructure {
    file: ProjectFile;
    //key is file name
    children: Map<string, ProjectFileStructure | ProjectFile>;
}

export interface TransitionStates {
    login:() => void;
    projects:() => void;
    project_files:(project_id:number) => void;
};