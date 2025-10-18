import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

const projectsFilePath = path.join(process.cwd(), 'src', 'data', 'projects.json');

async function getProjects() {
    try {
        const data = await fs.readFile(projectsFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') {
            return []; // Return an empty array if the file doesn't exist
        }
        throw error;
    }
}

export async function GET() {
    try {
        const projects = await getProjects();
        return NextResponse.json(projects);
    } catch (error) {
        console.error('Error reading projects:', error);
        return NextResponse.json({ message: 'Error reading projects' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const newProject = await request.json();
        const projects = await getProjects();

        newProject.id = `proj-${Date.now()}`;
        newProject.created_at = new Date().toISOString();

        projects.push(newProject);

        await fs.writeFile(projectsFilePath, JSON.stringify(projects, null, 2));

        return NextResponse.json(newProject, { status: 201 });
    } catch (error) {
        console.error('Error saving project:', error);
        return NextResponse.json({ message: 'Error saving project' }, { status: 500 });
    }
}