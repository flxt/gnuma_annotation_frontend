import assert from 'assert';

import {apiUrlBuilder, checkResponse} from './common';
import {Project, UnPersistedProject} from  '../state/anno/annoProjectReducer';
import {Document} from '../state/anno/annoDocumentReducer';
import {LabelSet, UnPersistedLabelSet} from '../state/anno/annoLabelSetReducer'

export const API_HOST = process.env.REACT_APP_ANNO_SERVICE_API_HOST;
export const API_PORT = process.env.REACT_APP_ANNO_SERVICE_API_PORT;
export const API_BASE = process.env.REACT_APP_ANNO_SERVICE_API_BASE;
export const API_VERSION = process.env.REACT_APP_ANNO_SERVICE_API_VERSION;

assert(API_HOST);
assert(API_PORT);
assert(API_BASE);
assert(API_VERSION);

const getApiUrl = apiUrlBuilder(API_HOST, API_PORT, API_BASE, API_VERSION);

// Get project metadata.
export const getSingleProject = async (projectId: string): Promise<Project> => {
    const endpoint = getApiUrl(`projects/${projectId}`);
    const response = await fetch(endpoint);
    checkResponse(response);
    return await response.json();
}

// Update project meta data.
// Update the metadata for a document.
export const updateProject = async (projectId: string, project: Partial<Project>): Promise<Project> => {
    const endpoint = getApiUrl(`projects/${projectId}`);
    const response = await fetch(endpoint, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(project)
    });
    checkResponse(response);

    return await getSingleProject(projectId);
}

// Get a list of all projects.
export const getAllProjects = async (): Promise<Project[]> => {
    const response = await fetch(getApiUrl('projects'));
    checkResponse(response);
    return await response.json();
}

// Create a new project.
export const createProject = async (project: UnPersistedProject): Promise<Project> => {
    const endpoint = getApiUrl('projects');

    const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(project)
    });
    checkResponse(response);

    const data = await response.json();
    return await getSingleProject(data);
}

// Delete a project.
export const deleteProject = async (projectId: string): Promise<void> => {
    const endpoint = getApiUrl(`projects/${projectId}`)
    const response = await fetch(endpoint, {method: 'DELETE',});
    checkResponse(response)
}

// Get all documents for a project
export const getAllDocuments = async (projectId: string): Promise<Document[]> => {
    const response = await fetch(getApiUrl(`projects/${projectId}/docs`));
    checkResponse(response);
    return await response.json();
}

// Add documents to the project.
export const addDocuments = async (projectId: string, documents: string[]): Promise<Document> => {
    const endpoint = getApiUrl(`projects/${projectId}/docs`);
    const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(documents)
    });
    checkResponse(response);

    return {'id': 'asdf', 'labeled': false}
}

// Delete a document.
export const deleteDocument = async (projectId: string, docId: string): Promise<void> => {
    const endpoint = getApiUrl(`projects/${projectId}/docs/${docId}`)
    const response = await fetch(endpoint, {method: 'DELETE',});
    checkResponse(response)
}

// Get list of all label sets.
export const getAllLabelSets = async (): Promise<LabelSet[]> => {
    const response = await fetch(getApiUrl('labels'));
    checkResponse(response);
    return await response.json();
}

// Create a new label set.
export const createLabelSet = async (labelSet: UnPersistedLabelSet): Promise<LabelSet> => {
    const endpoint = getApiUrl('labels');
    const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(labelSet)
    });
    checkResponse(response);

    const data = await response.json();
    return getSingleLabelSet(data);
}

// Get the metadata for a lable set.
export const getSingleLabelSet = async (labelSetId: string): Promise<LabelSet> => {
    const endpoint = getApiUrl(`labels/${labelSetId}`);
    const response = await fetch(endpoint);
    checkResponse(response);
    return await response.json();
}