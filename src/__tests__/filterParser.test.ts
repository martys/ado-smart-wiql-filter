import { parseFilterString } from '../filterParser';

describe('parseFilterString', () => {
    it('should parse a simple prefix and state filter', () => {
        const input = 'prefix:"DAT -" state:Active';
        const result = parseFilterString(input);
        expect(result).toEqual([
            { field: '[System.Title]', operator: 'STARTS WITH', value: 'DAT -', isNegated: false },
            { field: '[System.State]', operator: 'EQUALS', value: 'Active', isNegated: false }
        ]);
    });

    it('should parse an exact phrase with quotes on default fields', () => {
        const input = '"User Authentication"';
        const result = parseFilterString(input);
        expect(result).toEqual([
            { field: '[System.Title]', operator: 'CONTAINS', value: 'User Authentication', isNegated: false },
            { field: '[System.Description]', operator: 'CONTAINS', value: 'User Authentication', isNegated: false },
            { field: '[System.Tags]', operator: 'CONTAINS', value: 'User Authentication', isNegated: false }
        ]);
    });

    it('should parse a simple keyword on default fields and not return 9 clauses', () => {
        const input = 'DAT - task';
        const result = parseFilterString(input);
        expect(result.length).toBe(3); // Expecting one clause for each default field
        expect(result[0].value).toBe('DAT - task');
        expect(result[0].field).toBe('[System.Title]');
    });

    it('should parse negation with a minus sign on a tag', () => {
        const input = '-tag:Blocked';
        const result = parseFilterString(input);
        expect(result).toEqual([
            { field: '[System.Tags]', operator: 'NOT EQUALS', value: 'Blocked', isNegated: true }
        ]);
    });

    it('should parse a wildcard search on an explicit field', () => {
        const input = 'title:BugFix*';
        const result = parseFilterString(input);
        expect(result).toEqual([
            { field: '[System.Title]', operator: 'STARTS WITH', value: 'BugFix', isNegated: false }
        ]);
    });
});