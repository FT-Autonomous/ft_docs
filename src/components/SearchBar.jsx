/** @jsxImportSource preact */
import { useState, useEffect } from 'preact/hooks';
import FlexSearch from 'flexsearch';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [index, setIndex] = useState(null);

  useEffect(() => {
    async function loadIndex() {
      const res = await fetch('/api/search-index.json');
      const data = await res.json();
      console.log("📦 Loaded docs:", data);

      const flex = new FlexSearch.Document({
        tokenize: 'forward',
        document: {
          id: 'slug',
          index: ['title'],
          store: ['title', 'slug'],
        },
      });

      for (const doc of data) {
        flex.add(doc);
      }

      setIndex({ flex, docs: data });
    }

    loadIndex();
  }, []);

  const handleSearch = (q) => {
    setQuery(q);
    if (!q || !index) {
      setSuggestions([]);
      return;
    }

    console.log("🔍 Searching for:", q);

    const results = index.flex.search(q, {
      field: 'title',
      suggest: true,
      limit: 8,
      enrich: true,
    });

    console.log("📦 Raw FlexSearch results:", results);

    const enrichedDocs = results.flatMap(section =>
      section.result.map(r => r.doc)
    );

    const unique = Array.from(
      new Map(enrichedDocs.map(doc => [doc.slug, doc])).values()
    );

    console.log("✅ Final Suggestions:", unique);
    setSuggestions(unique);
  };

  return (
    <div style={{ padding: '1rem 0', position: 'relative' }}>
      <input
        type="text"
        placeholder="Search the docs..."
        value={query}
        onInput={(e) => handleSearch(e.target.value)}
        style={{
          width: '100%',
          padding: '10px',
          fontSize: '1rem',
          border: '1px solid #ccc',
          borderRadius: '4px',
          backgroundColor: '#fff',
          color: '#000',
        }}
      />

      {query && suggestions.length > 0 && (
        <ul
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            backgroundColor: '#fff',
            color: '#000',
            border: '1px solid #ccc',
            borderTop: 'none',
            maxHeight: '200px',
            overflowY: 'auto',
            zIndex: 999,
            margin: 0,
            padding: '0.5rem 0',
            listStyle: 'none',
          }}
        >
          {suggestions.map((s, i) => (
            <li key={i} style={{ padding: '0.5rem 1rem' }}>
              <a
                href={s.slug}
                style={{
                  textDecoration: 'none',
                  color: 'var(--linkHoverColor)',
                  fontWeight: 'bold',
                }}
              >
                {s.title}
              </a>
            </li>
          ))}
        </ul>
      )}

      {query && suggestions.length === 0 && (
        <p style={{ color: '#ccc', marginTop: '0.5rem' }}>No results found</p>
      )}
    </div>
  );
}
