import { parseFilterString } from '../filterParser';
import { generateWiql } from '../wiqlGenerator';

describe('generateWiql', () => {

  it('should generate a correct WIQL for a simple prefix and state filter', () => {
    const input = 'prefix:"DAT -" state:Active';
    const parsedClauses = parseFilterString(input);
    const wiql = generateWiql(parsedClauses);
    const expectedWiql = "SELECT [System.Id], [System.Title] FROM WorkItems WHERE [System.Title] STARTS WITH 'DAT -' AND [System.State] = 'Active'";
    expect(wiql).toBe(expectedWiql);
  });

  it('should generate a correct WIQL for a simple phrase search', () => {
    const input = '"User Authentication"';
    const parsedClauses = parseFilterString(input);
    const wiql = generateWiql(parsedClauses);
    // We expect a complex query with AND for default fields.
    const expectedWiql = "SELECT [System.Id], [System.Title] FROM WorkItems WHERE [System.Title] CONTAINS 'User Authentication' AND [System.Description] CONTAINS 'User Authentication' AND [System.Tags] CONTAINS 'User Authentication'";
    expect(wiql).toBe(expectedWiql);
  });

  it('should generate a correct WIQL for a negation filter', () => {
    const input = '-tag:Blocked';
    const parsedClauses = parseFilterString(input);
    const wiql = generateWiql(parsedClauses);
    const expectedWiql = "SELECT [System.Id], [System.Title] FROM WorkItems WHERE [System.Tags] != 'Blocked'";
    expect(wiql).toBe(expectedWiql);
  });

  it('should generate a default WIQL if no input is provided', () => {
    const input = '';
    const parsedClauses = parseFilterString(input);
    const wiql = generateWiql(parsedClauses);
    expect(wiql).toBe("SELECT [System.Id], [System.Title] FROM WorkItems");
  });

});