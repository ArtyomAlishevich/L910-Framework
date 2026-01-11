const fs = require('fs').promises
const path = require('path');
const crypto = require('crypto');

class FileHandler {
    constructor (dataDir = 'src/data') {
        this.dataDir = dataDir;
    }

    async readFile(filename) {
        try {
            const filePath = path.join(this.dataDir, filename);
            const data = await fs.readFile(filePath, 'utf8');
            return JSON.parse(data);
        }
        catch (error) {
             if (error.code === 'ENOENT') {
                return [];
            }
            throw error;
        }
    }

    async writeFile(filename, data) {
        const filePath = path.join(this.dataDir, filename);
        await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
    }

    async getAll(filename) {
        return this.readFile(filename);
    }

    async getById(filename, id) {
        const items = await this.readFile(filename);
        return items.find(item => item.id === id);
    }

    async create(filename, item) {
        const items = await this.readFile(filename);
        const newItem = {
            id: crypto.randomUUID(),
            ...item,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        items.push(newItem);
        await this.writeFile(filename, items);
        return newItem;
    }

    async update(filename, id, updates) {
        const items = await this.readFile(filename);
        const index = items.findIndex(item => item.id === id);

        if (index === -1) {
            return null;
        }

        items[index] = {
            ...items[index],
            ...updates,
            updatedAt: new Date().toISOString()
        }

        await this.writeFile(filename, items);
        return items[index];
    }

    async delete(filename, id) {
        const items = await this.readFile(filename);
        const filteredItems = items.filter(item => item.id !== id);
        
        if (filteredItems.length === items.length) {
            return false;
        }
        
        await this.writeFile(filename, filteredItems);
        return true;
    }
}

module.exports = FileHandler;