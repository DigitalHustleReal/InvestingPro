
// In-memory store
const db = {
  articles: [],
  users: [],
};

class SupabaseQueryBuilder {
  constructor(table) {
    this.table = table;
    this.filters = [];
    this.data = db[table] || [];
  }

  select(columns = '*') {
    return this;
  }

  insert(row) {
    console.log('MockSupabase: insert called with', row ? (Array.isArray(row) ? 'Array' : 'Object') : 'null');
    const newRow = { id: `id-${Date.now()}`, created_at: new Date().toISOString(), ...row };
    // Handle array if passed
    const rows = Array.isArray(row) ? row.map(r => ({ id: `id-${Date.now()}-${Math.random()}`, created_at: new Date().toISOString(), ...r })) : [newRow];
    
    if (this.table) {
        if (!db[this.table]) db[this.table] = [];
        db[this.table].push(...rows);
    }
    
    const ret = {
      select: () => {
          console.log('MockSupabase: select called');
          return {
            single: () => {
                console.log('MockSupabase: single called');
                return Promise.resolve({ data: rows[0], error: null });
            },
            data: rows,
            error: null
          };
      },
      then: (resolve) => resolve({ data: rows, error: null }),
      data: rows,
      error: null
    };
    return ret;
  }

  update(updates) {
    this.updates = updates;
    return this;
  }

  delete() {
    this.isDelete = true;
    return this;
  }

  eq(column, value) {
    this.filters.push(row => row[column] === value);
    return this;
  }
  
  not(column, operator, value) {
      if (operator === 'is' && value === null) {
           this.filters.push(row => row[column] !== null && row[column] !== undefined);
      }
      return this;
  }

  in(column, values) {
      this.filters.push(row => values.includes(row[column]));
      return this;
  }
  
  order(column, { ascending = true } = {}) {
      this.orderCol = column;
      this.orderAsc = ascending;
      return this;
  }
  
  limit(count) {
      this.limitCount = count;
      return this;
  }
  range(from, to) {
      this.rangeFrom = from;
      this.rangeTo = to;
      return this;
  }
  single() {
      const results = this._execute();
      return { data: results[0] || null, error: null };
  }

  _execute() {
    let results = this.data;
    console.log(`MockSupabase: _execute on table ${this.table}, initial count: ${results.length}`);
    
    // Apply filters
    for (const filter of this.filters) {
        results = results.filter(filter);
    }
    console.log(`MockSupabase: after filters, count: ${results.length}`);
    
    // Apply updates
    if (this.updates) {
        console.log('MockSupabase: applying updates', this.updates);
        results.forEach(row => {
            Object.assign(row, this.updates);
            console.log('MockSupabase: updated row', row.id, row.status);
        });
    }
    
    return results;
  }
  
  then(resolve) {
      const results = this._execute();
      if (this.updates || this.isDelete) {
           // For simple tests, we assume success
           resolve({ data: results, error: null, count: results.length });
      } else {
           resolve({ data: results, error: null, count: results.length });
      }
  }
}

const mockSupabase = {
  from: (table) => new SupabaseQueryBuilder(table),
  auth: {
    getUser: async () => ({
        data: {
          user: { 
            id: 'test-user-id', 
            email: 'test@example.com',
            user_metadata: { full_name: 'Test User' },
            role: 'authenticated'
          } 
        },
        error: null
    }),
    signInWithPassword: async ({ email, password }) => ({
        data: {
          user: { 
            id: 'test-user-id', 
            email,
            user_metadata: { full_name: 'Test User' },
            role: 'authenticated'
          },
          session: {
            access_token: 'test-access-token',
            refresh_token: 'test-refresh-token',
            expires_in: 3600,
            token_type: 'bearer',
            user: {
              id: 'test-user-id',
              email
            }
          }
        },
        error: null
    }),
    signUp: async ({ email, password }) => ({
        data: {
          user: { 
            id: 'test-user-' + Date.now(), 
            email,
            user_metadata: {},
            role: 'authenticated'
          },
          session: null
        },
        error: null
    }),
    signOut: async () => ({
        error: null
    }),
    getSession: async () => ({
        data: {
          session: {
            access_token: 'test-access-token',
            refresh_token: 'test-refresh-token',
            expires_in: 3600,
            token_type: 'bearer',
            user: {
              id: 'test-user-id',
              email: 'test@example.com'
            }
          }
        },
        error: null
    }),
    admin: {
        createUser: async ({ email }) => ({
            data: { 
                user: { 
                    id: 'test-user-' + Date.now(),
                    email,
                    email_confirmed_at: new Date().toISOString()
                } 
            },
            error: null
        }),
        deleteUser: async () => ({ data: {}, error: null })
    }
  },
  rpc: async () => ({ data: [], error: null })
};

module.exports = {
  createClient: () => mockSupabase
};
