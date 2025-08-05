import { FilterClause } from './filterParser';

export function generateWiql(clauses: FilterClause[]): string {
  if (!clauses || clauses.length === 0) {
    return "SELECT [System.Id], [System.Title] FROM WorkItems";
  }

  const whereClauses = clauses.map(clause => {
    // WIQL values need to be single-quoted. Special values like @Me don't.
    const wiqlValue = clause.value.startsWith('@') ? clause.value : `'${clause.value}'`;

    // Map the human-readable operator to the correct WIQL syntax.
    let wiqlOperator: string;
    switch (clause.operator) {
      case 'STARTS WITH':
        wiqlOperator = 'STARTS WITH';
        break;
      case 'CONTAINS':
        wiqlOperator = 'CONTAINS';
        break;
      case 'EQUALS':
        wiqlOperator = clause.isNegated ? '!=' : '=';
        break;
      case 'NOT EQUALS':
        wiqlOperator = '!=';
        break;
      case 'NOT CONTAINS':
        wiqlOperator = 'NOT CONTAINS';
        break;
      default:
        wiqlOperator = '='; // Default to equals for safety
    }

    return `${clause.field} ${wiqlOperator} ${wiqlValue}`;
  });

  const whereClauseString = whereClauses.join(' AND ');

  return `SELECT [System.Id], [System.Title] FROM WorkItems WHERE ${whereClauseString}`;
}