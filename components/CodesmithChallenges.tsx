
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useRef } from 'react';

// ─── Challenge logic (same code from the notebook) ─────────────────────────

function pluralize(animals: string[]): string[] {
  const output: string[] = [];
  for (let i = 0; i < animals.length; i++) {
    output.push(animals[i] + 's');
  }
  return output;
}

function once<T>(callback: (...args: unknown[]) => T) {
  let hasBeenCalled = false;
  let result: T | undefined;
  return function (...args: unknown[]): T | undefined {
    if (!hasBeenCalled) {
      result = callback(...args);
      hasBeenCalled = true;
    }
    return result;
  };
}

function createCounter(label: string, initialValue = 0, step = 1) {
  let value = initialValue;
  let currentStep = step;
  const listeners: ((v: number) => void)[] = [];
  const notify = () => listeners.forEach(fn => fn(value));
  return {
    increment() { value += currentStep; notify(); return value; },
    decrement() { value -= currentStep; notify(); return value; },
    setStep(s: number) { currentStep = s; },
    reset(v = 0) { value = v; notify(); return value; },
    getValue() { return value; },
    subscribe(fn: (v: number) => void) { listeners.push(fn); },
    getStep() { return currentStep; },
    label,
  };
}

function cycleIterator<T>(array: T[]) {
  let index = 0;
  return function () {
    const value = array[index];
    index = (index + 1) % array.length;
    return value;
  };
}

function after(times: number, callback: (...args: unknown[]) => string) {
  let counter = 0;
  return function (...args: unknown[]): string | undefined {
    counter++;
    if (counter >= times) return callback(...args);
    return undefined;
  };
}

function censorText(text: string, badWords: string[]): string {
  let result = text;
  badWords.forEach(word => {
    if (!word.trim()) return;
    const regex = new RegExp(word.trim(), 'gi');
    result = result.replace(regex, '*'.repeat(word.trim().length));
  });
  return result;
}

// ─── Shared UI primitives ───────────────────────────────────────────────────

const CodeBlock: React.FC<{ code: string }> = ({ code }) => (
  <pre className="text-xs font-mono bg-zinc-950 border border-zinc-800 rounded-lg p-3 overflow-x-auto text-green-400 leading-relaxed whitespace-pre-wrap">
    {code}
  </pre>
);

const Tag: React.FC<{ label: string }> = ({ label }) => (
  <span className="text-xs font-bold text-blue-400 uppercase tracking-wide">{label}</span>
);

// ─── 1. Pluralize ───────────────────────────────────────────────────────────

const PluralizeDemo: React.FC = () => {
  const [input, setInput] = useState('dog, cat, tree frog');
  const words = input.split(',').map(s => s.trim()).filter(Boolean);
  const result = pluralize(words);

  return (
    <div className="space-y-3">
      <div>
        <label className="text-xs text-zinc-500 font-mono mb-1 block">Enter words (comma-separated)</label>
        <input
          className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 font-mono focus:outline-none focus:border-blue-500 transition-colors"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="dog, cat, fox"
        />
      </div>
      {result.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {result.map((word, i) => (
            <span key={i} className="px-3 py-1 bg-blue-500/10 border border-blue-500/30 rounded-full text-blue-300 text-sm font-mono">
              {word}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── 2. Once ────────────────────────────────────────────────────────────────

const OnceDemo: React.FC = () => {
  const [log, setLog] = useState<string[]>([]);
  const addByTwoOnce = useRef(once((num: unknown) => (num as number) + 2)).current;

  const handleClick = () => {
    const val = Math.floor(Math.random() * 10) + 1;
    const result = addByTwoOnce(val);
    setLog(prev => [
      ...prev,
      `addByTwoOnce(${val}) → ${result !== undefined ? result : '(locked — returns first result: ' + addByTwoOnce(0) + ')'}`,
    ]);
  };

  return (
    <div className="space-y-3">
      <p className="text-xs text-zinc-400">The function only executes on the <span className="text-blue-400 font-semibold">first call</span>. Every subsequent call returns the cached result.</p>
      <button
        onClick={handleClick}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg transition-colors"
      >
        Call addByTwoOnce(random)
      </button>
      {log.length > 0 && (
        <div className="space-y-1 font-mono text-xs">
          {log.map((line, i) => (
            <div key={i} className={`px-2 py-1 rounded ${i === 0 ? 'text-green-400 bg-green-500/10' : 'text-zinc-500 bg-zinc-900'}`}>
              {i === 0 ? '✓ ' : '↩ '}{line}
            </div>
          ))}
        </div>
      )}
      {log.length > 0 && (
        <button onClick={() => setLog([])} className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors">
          reset log
        </button>
      )}
    </div>
  );
};

// ─── 3. Closure Counter ─────────────────────────────────────────────────────

const ClosureCounterDemo: React.FC = () => {
  const counterA = useRef(createCounter('Photo Edits', 0, 2)).current;
  const counterB = useRef(createCounter('New Clients', 10, 1)).current;

  const [valA, setValA] = useState(counterA.getValue());
  const [valB, setValB] = useState(counterB.getValue());
  const [stepA, setStepA] = useState(counterA.getStep());
  const [stepB, setStepB] = useState(counterB.getStep());

  const act = (counter: ReturnType<typeof createCounter>, setter: React.Dispatch<React.SetStateAction<number>>, fn: () => number) => {
    fn(); setter(counter.getValue());
  };

  return (
    <div className="space-y-4">
      <p className="text-xs text-zinc-400">Two independent counters — each closes over its own private state.</p>
      {[
        { c: counterA, val: valA, setVal: setValA, step: stepA, setStep: setStepA },
        { c: counterB, val: valB, setVal: setValB, step: stepB, setStep: setStepB },
      ].map(({ c, val, setVal, step, setStep }) => (
        <div key={c.label} className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-zinc-500">{c.label}</span>
            <span className="text-3xl font-bold text-white tabular-nums">{val}</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button onClick={() => act(c, setVal, () => c.decrement())} className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-sm transition-colors">−</button>
            <button onClick={() => act(c, setVal, () => c.increment())} className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm transition-colors">+</button>
            <button onClick={() => { c.reset(0); setVal(c.getValue()); }} className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 rounded-lg text-xs transition-colors">reset</button>
            <div className="flex items-center gap-1 ml-auto">
              <span className="text-xs text-zinc-600 font-mono">step:</span>
              <input
                type="number"
                className="w-14 bg-zinc-900 border border-zinc-700 rounded px-2 py-0.5 text-xs text-zinc-300 font-mono focus:outline-none focus:border-blue-500"
                value={step}
                onChange={e => {
                  const s = Number(e.target.value);
                  c.setStep(s);
                  setStep(s);
                }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// ─── 4. CycleIterator ───────────────────────────────────────────────────────

const CycleIteratorDemo: React.FC = () => {
  const ITEMS = ['Friday', 'Saturday', 'Sunday'];
  const getDay = useRef(cycleIterator(ITEMS)).current;
  const [current, setCurrent] = useState(ITEMS[0]);
  const [history, setHistory] = useState<string[]>([ITEMS[0]]);

  const next = () => {
    const day = getDay();
    setCurrent(day);
    setHistory(prev => [...prev, day].slice(-6));
  };

  const colors: Record<string, string> = {
    Friday: 'text-purple-400 border-purple-500/40 bg-purple-500/10',
    Saturday: 'text-amber-400 border-amber-500/40 bg-amber-500/10',
    Sunday: 'text-blue-400 border-blue-500/40 bg-blue-500/10',
  };

  return (
    <div className="space-y-4">
      <p className="text-xs text-zinc-400">Iterator cycles through an array indefinitely, looping back to start.</p>
      <div className="text-center">
        <div className={`inline-block px-6 py-3 border rounded-xl font-bold text-2xl transition-all ${colors[current]}`}>
          {current}
        </div>
      </div>
      <div className="flex gap-1 flex-wrap">
        {history.map((d, i) => (
          <span key={i} className={`text-xs px-2 py-0.5 rounded border font-mono ${i === history.length - 1 ? colors[d] : 'text-zinc-600 border-zinc-800'}`}>
            {d.slice(0, 3)}
          </span>
        ))}
      </div>
      <button
        onClick={next}
        className="w-full px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 text-sm font-semibold rounded-lg transition-colors"
      >
        getDay() →
      </button>
    </div>
  );
};

// ─── 5. After ───────────────────────────────────────────────────────────────

const AfterDemo: React.FC = () => {
  const [n, setN] = useState(3);
  const [clicks, setClicks] = useState(0);
  const [fired, setFired] = useState(false);
  const fnRef = useRef(after(n, () => 'hello world'));

  const reset = (newN: number) => {
    setN(newN);
    setClicks(0);
    setFired(false);
    fnRef.current = after(newN, () => 'hello world');
  };

  const handleClick = () => {
    const newClicks = clicks + 1;
    setClicks(newClicks);
    const result = fnRef.current();
    if (result !== undefined) setFired(true);
  };

  return (
    <div className="space-y-4">
      <p className="text-xs text-zinc-400">The callback only fires on or after the <span className="text-blue-400 font-semibold">Nth call</span>. All prior calls return <code className="text-zinc-500">undefined</code>.</p>
      <div className="flex items-center gap-3">
        <span className="text-xs text-zinc-500 font-mono">Fire after</span>
        <input
          type="number"
          min={1}
          max={10}
          className="w-16 bg-zinc-950 border border-zinc-700 rounded px-2 py-1 text-sm text-zinc-200 font-mono focus:outline-none focus:border-blue-500"
          value={n}
          onChange={e => reset(Number(e.target.value))}
        />
        <span className="text-xs text-zinc-500 font-mono">clicks</span>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex gap-1">
          {Array.from({ length: n }).map((_, i) => (
            <div key={i} className={`w-4 h-4 rounded-sm transition-all ${i < clicks ? (i >= n - 1 || clicks >= n ? 'bg-green-500' : 'bg-blue-500') : 'bg-zinc-800'}`} />
          ))}
        </div>
        <span className="text-xs text-zinc-500 font-mono">{clicks}/{n}</span>
      </div>

      <button
        onClick={handleClick}
        disabled={fired}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors"
      >
        {fired ? '✓ Fired!' : `afterCalled() — click ${n - clicks > 0 ? n - clicks : 0} more`}
      </button>

      {fired && (
        <div className="text-green-400 font-mono text-sm bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-2">
          → "hello world"
        </div>
      )}
      {clicks > 0 && !fired && (
        <div className="text-zinc-600 font-mono text-sm">→ undefined</div>
      )}
    </div>
  );
};

// ─── 6. Censor ──────────────────────────────────────────────────────────────

const CensorDemo: React.FC = () => {
  const [text, setText] = useState("What the darn heck is going on here?");
  const [badWords, setBadWords] = useState("darn, heck");
  const censored = censorText(text, badWords.split(','));
  const changed = censored !== text;

  return (
    <div className="space-y-3">
      <div>
        <label className="text-xs text-zinc-500 font-mono mb-1 block">Text to filter</label>
        <textarea
          rows={2}
          className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 font-mono focus:outline-none focus:border-blue-500 transition-colors resize-none"
          value={text}
          onChange={e => setText(e.target.value)}
        />
      </div>
      <div>
        <label className="text-xs text-zinc-500 font-mono mb-1 block">Words to censor (comma-separated)</label>
        <input
          className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 font-mono focus:outline-none focus:border-blue-500 transition-colors"
          value={badWords}
          onChange={e => setBadWords(e.target.value)}
        />
      </div>
      <div className="bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2">
        <span className="text-xs text-zinc-600 font-mono block mb-1">output:</span>
        <span className={`text-sm font-mono ${changed ? 'text-amber-300' : 'text-zinc-400'}`}>{censored || '—'}</span>
      </div>
    </div>
  );
};

// ─── Challenge card wrapper ─────────────────────────────────────────────────

interface ChallengeCardProps {
  tag: string;
  title: string;
  code: string;
  demo: React.ReactNode;
}

const ChallengeCard: React.FC<ChallengeCardProps> = ({ tag, title, code, demo }) => {
  const [showCode, setShowCode] = useState(false);

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 rounded-xl p-6 transition-all duration-300 flex flex-col gap-4">
      <div>
        <Tag label={tag} />
        <h3 className="text-xl font-semibold text-zinc-100 mt-1">{title}</h3>
      </div>

      {/* Demo */}
      <div className="flex-1">{demo}</div>

      {/* Code toggle */}
      <div>
        <button
          onClick={() => setShowCode(v => !v)}
          className="text-xs text-zinc-600 hover:text-zinc-400 font-mono transition-colors flex items-center gap-1"
        >
          <span>{showCode ? '▾' : '▸'}</span> {showCode ? 'hide code' : 'view solution'}
        </button>
        {showCode && <div className="mt-2"><CodeBlock code={code} /></div>}
      </div>
    </div>
  );
};

// ─── Main section ───────────────────────────────────────────────────────────

const challenges: ChallengeCardProps[] = [
  {
    tag: 'Arrays / Loops',
    title: 'Pluralize',
    demo: <PluralizeDemo />,
    code: `function pluralize(animals) {
  let output = [];
  for (let i = 0; i < animals.length; i++) {
    output.push(animals[i] + "s");
  }
  return output;
}

pluralize(["dog", "cat", "tree frog"]);
// → ["dogs", "cats", "tree frogs"]`,
  },
  {
    tag: 'Closures',
    title: 'once()',
    demo: <OnceDemo />,
    code: `function once(callback) {
  let hasBeenCalled = false;
  let result;
  return function(...args) {
    if (!hasBeenCalled) {
      result = callback(...args);
      hasBeenCalled = true;
    }
    return result; // always returns first result
  };
}

const addByTwoOnce = once(num => num + 2);
addByTwoOnce(5);    // → 7
addByTwoOnce(10);   // → 7  (cached)
addByTwoOnce(9001); // → 7  (cached)`,
  },
  {
    tag: 'Closures',
    title: 'createCounter()',
    demo: <ClosureCounterDemo />,
    code: `function createCounter(label, initialValue = 0, step = 1) {
  let value = initialValue;
  let currentStep = step;

  return {
    increment() { value += currentStep; return value; },
    decrement() { value -= currentStep; return value; },
    setStep(s)  { currentStep = s; },
    reset(v=0)  { value = v; return value; },
    getValue()  { return value; },
  };
}

const photoCounter = createCounter("Photo Edits", 0, 2);
photoCounter.increment(); // 2
photoCounter.increment(); // 4
photoCounter.setStep(5);
photoCounter.increment(); // 9`,
  },
  {
    tag: 'Closures / Iterators',
    title: 'cycleIterator()',
    demo: <CycleIteratorDemo />,
    code: `function cycleIterator(array) {
  let index = 0;
  return function() {
    const value = array[index];
    index = (index + 1) % array.length; // loop back
    return value;
  };
}

const getDay = cycleIterator(["Fri","Sat","Sun"]);
getDay(); // "Fri"
getDay(); // "Sat"
getDay(); // "Sun"
getDay(); // "Fri"  ← loops back`,
  },
  {
    tag: 'Closures / HOF',
    title: 'after()',
    demo: <AfterDemo />,
    code: `function after(times, callback) {
  let counter = 0;
  return function(...args) {
    counter++;
    if (counter >= times) return callback(...args);
    // returns undefined until Nth call
  };
}

const called = str => "hello " + str;
const afterCalled = after(3, called);

afterCalled("world"); // → undefined
afterCalled("world"); // → undefined
afterCalled("world"); // → "hello world"`,
  },
  {
    tag: 'Strings / Regex',
    title: 'censor()',
    demo: <CensorDemo />,
    code: `function censor(text, badWords) {
  let result = text;
  badWords.forEach(word => {
    const regex = new RegExp(word, "gi");
    result = result.replace(regex, "*".repeat(word.length));
  });
  return result;
}

censor("What the darn heck?", ["darn","heck"]);
// → "What the **** **** ?"`,
  },
];

export const CodesmithChallenges: React.FC = () => {
  return (
    <section id="js-challenges" className="py-20 px-4 max-w-6xl mx-auto">
      <div className="mb-10">
        <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-2">Interactive Playground</p>
        <h2 className="text-4xl font-bold text-white font-gemola tracking-wide">JavaScript Challenges</h2>
        <p className="text-zinc-400 mt-3 max-w-xl">
          Codesmith prep challenges — each card runs the real solution in the browser.
          Toggle <span className="text-zinc-300 font-mono text-sm">view solution</span> to see the code.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {challenges.map((ch, i) => (
          <ChallengeCard key={i} {...ch} />
        ))}
      </div>
    </section>
  );
};
