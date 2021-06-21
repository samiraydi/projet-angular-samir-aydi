import { Injectable } from '@angular/core';
import { getGlobal, setGlobal } from 'src/app/app-config';
import { Tool } from "src/models/tool.model";
import { AuthService } from '../AuthService';

@Injectable({
  providedIn: 'root'
})
export class ToolService {

  constructor(private authService: AuthService) {}

  private getTools(): Tool[] {
    return getGlobal()['tools'];
  }

  private setTools(tools: Tool[]): void {
    setGlobal({
      ...getGlobal(),
      tools
    });
  }

  getById(id: string): Promise<Tool | null> {
    return Promise.resolve(this.getTools().find(item => item.id === id) || null);
  }

  getAll(): Promise<Tool[]> {
    return Promise.resolve(this.getTools());
  }

  addTool(tool: Tool): Promise<Tool> {
    tool = this.prepareToolToSave(tool);
    this.saveTool(tool);
    return Promise.resolve(tool);
  }

  edit(id: string, tool: Tool): Promise<Tool | null> {
    const tools = this.getTools();
    const toolIndex = tools.findIndex(item => item.id === id);

    if (toolIndex === -1) {
      return Promise.resolve(null);
    }
    tools[toolIndex] = this.prepareToolToEdit(tools[toolIndex], tool);
    this.setTools(tools);

    return Promise.resolve(tools[toolIndex]);
  }

  delete(id: string): Promise<void> {
    const tools = this.getTools();
    this.setTools(tools.filter(item => item.id !== id));
    return Promise.resolve();
  }

  private prepareToolToSave(tool: Tool): Tool {
    const creationDate = new Date();
    return {
      ...tool,
      id: creationDate.getTime().toString(),
      author_id: this.authService.currentUserState.id,
      creationDate
    };
  }

  private prepareToolToEdit(toolOldData: Tool, toolNewData: Tool): Tool {
    return {
      ...toolNewData,
      id: toolOldData.id,
      author_id: toolOldData.author_id,
      creationDate: toolOldData.creationDate
    };
  }

  private saveTool(tool: Tool) {
    const tools = this.getTools();
    tools.push(tool);
    this.setTools(tools);
  }
}
