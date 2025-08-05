// Define the structure for a parsed filter object.
export interface FilterClause {
  field: string;
  operator: 'STARTS WITH' | 'CONTAINS' | 'EQUALS' | 'NOT EQUALS' | 'NOT CONTAINS';
  value: string;
  isNegated: boolean;
}

// A mapping of user-friendly names to ADO's WIQL field reference names.
const fieldMap: { [key: string]: string } = {
  'title': '[System.Title]',
  'description': '[System.Description]',
  'tag': '[System.Tags]',
  'id': '[System.Id]',
  'state': '[System.State]',
  'assignedto': '[System.AssignedTo]',
  'prefix': '[System.Title]' // Map 'prefix' directly
};

// Default fields to search if no explicit field is given.
const defaultFields = ['[System.Title]', '[System.Description]', '[System.Tags]'];

export function parseFilterString(input: string): FilterClause[] {
  const clauses: FilterClause[] = [];
  const regex = /(?:(-)?(\w+):)?("([^"]*)"|([^\s"]+))/g;
  let match;
  let hasExplicitClauses = false;

  const parsedTerms: { fieldKey?: string; value: string; isNegated: boolean }[] = [];
  
  // First pass to parse all terms
  while ((match = regex.exec(input)) !== null) {
      const isNegated = !!match[1];
      const fieldKey = match[2] ? match[2].toLowerCase() : undefined;
      const value = match[4] || match[5];

      if (fieldKey) {
          hasExplicitClauses = true;
          parsedTerms.push({ fieldKey, value, isNegated });
      } else {
          parsedTerms.push({ value, isNegated });
      }
  }

  if (hasExplicitClauses || parsedTerms.some(t => t.fieldKey)) {
      // Process explicit and combined terms
      parsedTerms.forEach(term => {
          let fieldsToSearch = term.fieldKey ? [fieldMap[term.fieldKey] || term.fieldKey] : defaultFields;
          for (const field of fieldsToSearch) {
              let value = term.value;
              let operator: FilterClause['operator'];

              // --- THE FIX IS HERE ---
              // Explicitly handle the 'prefix' key as a special case.
              if (term.fieldKey === 'prefix') {
                  operator = 'STARTS WITH';
              } else if (value.includes('*') || value.includes('?')) {
                  // For wildcards, we use STARTS WITH or CONTAINS
                  if (value.startsWith('*') && value.endsWith('*')) {
                      operator = 'CONTAINS';
                      value = value.substring(1, value.length - 1);
                  } else if (value.startsWith('*')) {
                      operator = 'CONTAINS';
                      value = value.substring(1);
                  } else {
                      operator = 'STARTS WITH';
                      value = value.replace(/\*|\?/g, '');
                  }
              } else {
                  // For exact matches, we use EQUALS or CONTAINS
                  operator = term.isNegated ? 'NOT EQUALS' : 'EQUALS';
                  if (field === '[System.Title]' && operator === 'EQUALS' && value.split(' ').length > 1) {
                      operator = 'CONTAINS'; // Phrase search
                  }
              }
              // --- END OF FIX ---

              clauses.push({
                  field,
                  operator,
                  value,
                  isNegated: term.isNegated,
              });
          }
      });
  } else if (input.trim() !== '') {
      // Handle simple keyword search
      const terms = [];
      let simpleMatch;
      const simpleKeywordRegex = /"([^"]*)"|([^\s"]+)/g;
      while ((simpleMatch = simpleKeywordRegex.exec(input)) !== null) {
          terms.push(simpleMatch[1] || simpleMatch[2]);
      }
      
      const fullPhrase = terms.join(' ');

      defaultFields.forEach(field => {
          clauses.push({
              field,
              operator: 'CONTAINS',
              value: fullPhrase,
              isNegated: false,
          });
      });
  }

  return clauses;
}