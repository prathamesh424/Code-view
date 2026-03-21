'use client';

import { useMemo } from 'react';
import { useEditorStore } from '@/stores/editor-store';
import { EXAMPLE_LIST, getExampleById } from '@/lib/examples';

export function SampleSelector() {
  const { setCode, setLanguage, language } = useEditorStore();

  const options = useMemo(
    () => EXAMPLE_LIST.filter((example) => example.language === language),
    [language]
  );

  const onChange = (id: string) => {
    const sample = getExampleById(id);
    if (!sample) return;
    setLanguage(sample.language);
    setCode(sample.code);
  };

  return (
    <select
      onChange={(e) => onChange(e.target.value)}
      defaultValue=""
      className="px-2 py-1.5 rounded-md border border-border bg-background text-xs text-foreground focus:outline-none focus:border-accent"
    >
      <option value="" disabled>
        Sample code
      </option>
      {options.map((sample) => (
        <option key={sample.id} value={sample.id}>
          {sample.title}
        </option>
      ))}
    </select>
  );
}
