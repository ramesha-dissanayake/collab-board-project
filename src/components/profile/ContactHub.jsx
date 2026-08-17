import { useMemo, useState } from 'react';
import Avatar from './Avatar';
import Icon from './Icons';
import {
  contactDirectory,
  initialContacts,
  initialReceivedRequests,
  initialRecentFriends,
  initialSentRequests,
} from '../../data/profileData';

const menuItems = [
  { id: 'add', label: 'New contact', description: 'Find someone by user ID', icon: 'personPlus' },
  { id: 'group', label: 'New group', description: 'Create a group from your contacts', icon: 'group' },
  { id: 'sent', label: 'Requests sent', description: 'Review pending invitations', icon: 'send' },
  { id: 'recent', label: 'New friends', description: 'See your latest connections', icon: 'clock' },
  { id: 'received', label: 'New requests', description: 'Accept incoming invitations', icon: 'inbox' },
];

function editDistance(left, right) {
  const matrix = Array.from({ length: left.length + 1 }, (_, row) => [row]);
  for (let column = 1; column <= right.length; column += 1) matrix[0][column] = column;
  for (let row = 1; row <= left.length; row += 1) {
    for (let column = 1; column <= right.length; column += 1) {
      const cost = left[row - 1] === right[column - 1] ? 0 : 1;
      matrix[row][column] = Math.min(
        matrix[row - 1][column] + 1,
        matrix[row][column - 1] + 1,
        matrix[row - 1][column - 1] + cost,
      );
    }
  }
  return matrix[left.length][right.length];
}

function SearchInput({ value, onChange, placeholder, label = placeholder, autoFocus = false }) {
  return (
    <div className="relative">
      <Icon name="search" className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400" />
      <input autoFocus={autoFocus} value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-xl border border-stone-200 bg-stone-50 py-3 pl-11 pr-4 text-sm font-medium text-stone-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" placeholder={placeholder} aria-label={label} />
    </div>
  );
}

function PersonRow({ person, action, meta, selected, onSelect }) {
  const content = (
    <>
      <Avatar person={person} size="md" selected={selected} />
      <div className="min-w-0 flex-1 text-left">
        <p className="truncate text-sm font-extrabold text-stone-900">{person.name}</p>
        <p className="truncate text-xs font-medium text-stone-500">{meta || `${person.id} · ${person.role}`}</p>
      </div>
      {selected && <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-white"><Icon name="check" className="h-4 w-4" /></span>}
      {action}
    </>
  );

  return onSelect ? (
    <button type="button" onClick={onSelect} className="flex w-full items-center gap-3 rounded-xl px-2 py-2.5 transition hover:bg-stone-50">{content}</button>
  ) : (
    <div className="flex items-center gap-3 rounded-xl px-2 py-2.5">{content}</div>
  );
}

function EmptyState({ title, description }) {
  return <div className="rounded-2xl border border-dashed border-stone-300 p-8 text-center"><p className="font-extrabold text-stone-800">{title}</p><p className="mt-1 text-sm text-stone-500">{description}</p></div>;
}

export default function ContactHub({ open, onClose }) {
  const [screen, setScreen] = useState('home');
  const [query, setQuery] = useState('');
  const [contacts, setContacts] = useState(initialContacts);
  const [sentRequests, setSentRequests] = useState(initialSentRequests);
  const [recentFriends, setRecentFriends] = useState(initialRecentFriends);
  const [receivedRequests, setReceivedRequests] = useState(initialReceivedRequests);
  const [selected, setSelected] = useState([]);
  const [groupStep, setGroupStep] = useState(1);
  const [groupName, setGroupName] = useState('');
  const [notice, setNotice] = useState('');

  const close = () => {
    setScreen('home'); setQuery(''); setSelected([]); setGroupStep(1); setGroupName(''); setNotice(''); onClose();
  };

  const goTo = (next) => {
    setScreen(next); setQuery(''); setSelected([]); setGroupStep(1); setGroupName(''); setNotice('');
  };

  const filteredContacts = useMemo(() => contacts.filter((person) => person.name.toLowerCase().includes(query.toLowerCase())), [contacts, query]);

  if (!open) return null;

  const sendRequest = (person) => {
    if (!sentRequests.some((request) => request.id === person.id)) setSentRequests((current) => [...current, person]);
    setNotice(`Request sent to ${person.name}.`);
  };

  const acceptRequest = (person) => {
    setReceivedRequests((current) => current.filter((request) => request.id !== person.id));
    if (!contacts.some((contact) => contact.id === person.id)) setContacts((current) => [...current, person]);
    setRecentFriends((current) => [{ ...person, added: 'Just now' }, ...current]);
    setNotice(`${person.name} is now a contact.`);
  };

  const toggleSelected = (id) => setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);

  const headerTitle = screen === 'home' ? 'Contacts' : menuItems.find((item) => item.id === screen)?.label;

  const renderHome = () => (
    <>
      {notice && <p className="mb-3 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">{notice}</p>}
      <SearchInput value={query} onChange={setQuery} placeholder="Search existing contacts" />
      <div className="mt-4 grid gap-2">
        {menuItems.map((item) => (
          <button key={item.id} type="button" onClick={() => goTo(item.id)} className="group flex items-center gap-3 rounded-2xl border border-transparent px-3 py-2.5 text-left transition hover:border-stone-200 hover:bg-stone-50">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700"><Icon name={item.icon} className="h-5 w-5" /></span>
            <span className="min-w-0 flex-1"><span className="block text-sm font-extrabold text-stone-900">{item.label}</span><span className="block truncate text-xs text-stone-500">{item.description}</span></span>
            {item.id === 'received' && receivedRequests.length > 0 && <span className="rounded-full bg-rose-500 px-2 py-0.5 text-xs font-extrabold text-white">{receivedRequests.length}</span>}
            <Icon name="chevron" className="h-4 w-4 text-stone-300 group-hover:text-emerald-600" />
          </button>
        ))}
      </div>
      <div className="my-4 border-t border-stone-100" />
      <div className="flex items-center justify-between px-2"><h3 className="text-xs font-extrabold uppercase tracking-[0.15em] text-stone-400">Contacts</h3><span className="text-xs font-bold text-stone-400">{filteredContacts.length}</span></div>
      <div className="mt-2 max-h-64 overflow-y-auto pr-1">
        {filteredContacts.length ? filteredContacts.map((person) => <PersonRow key={person.id} person={person} />) : <EmptyState title="No contacts found" description="Try searching another name." />}
      </div>
    </>
  );

  const renderAdd = () => {
    const normalized = query.trim().toLowerCase();
    const candidates = contactDirectory.filter((person) => !contacts.some((contact) => contact.id === person.id));
    const directMatches = candidates.filter((person) => person.id.toLowerCase().includes(normalized));
    const results = !normalized ? [] : directMatches.length ? directMatches : candidates
      .map((person) => ({ ...person, distance: editDistance(person.id.toLowerCase(), normalized) }))
      .sort((a, b) => a.distance - b.distance)
      .filter((person) => person.distance <= 3)
      .slice(0, 3);
    return <>
      <p className="mb-4 text-sm leading-6 text-stone-500">Enter a CollabBoard user ID. Close matches will appear if the ID is slightly wrong.</p>
      <SearchInput value={query} onChange={(value) => { setQuery(value); setNotice(''); }} placeholder="Search user ID (for example CB-1402)" autoFocus />
      {notice && <p className="mt-3 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">{notice}</p>}
      <div className="mt-4 space-y-1">
        {!query.trim() ? <EmptyState title="Search by user ID" description="Results will appear here." /> : results.length ? results.map((person) => <PersonRow key={person.id} person={person} action={<button type="button" onClick={() => sendRequest(person)} className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-extrabold text-white hover:bg-emerald-700">Add</button>} />) : <EmptyState title="No similar ID found" description="Check the ID and try again." />}
      </div>
    </>;
  };

  const renderGroup = () => {
    const people = contacts.filter((person) => person.name.toLowerCase().includes(query.toLowerCase()));
    const selectedPeople = contacts.filter((person) => selected.includes(person.id));
    if (groupStep === 2) return <>
      <label className="block text-sm font-extrabold text-stone-700">Group name<input autoFocus value={groupName} onChange={(event) => setGroupName(event.target.value)} className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 font-medium outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" placeholder="Enter a group name" /></label>
      <p className="mb-3 mt-6 text-xs font-extrabold uppercase tracking-[0.15em] text-stone-400">Members · {selectedPeople.length}</p>
      <div className="flex items-center -space-x-3">{selectedPeople.slice(0, 3).map((person) => <Avatar key={person.id} person={person} size="md" />)}{selectedPeople.length > 3 && <span className="z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 border-white bg-stone-800 text-xs font-extrabold text-white">+{selectedPeople.length - 3}</span>}</div>
      <div className="mt-8 flex gap-3"><button type="button" onClick={() => setGroupStep(1)} className="flex-1 rounded-xl border border-stone-200 py-3 font-bold text-stone-600">Back</button><button type="button" disabled={!groupName.trim()} onClick={() => { setNotice(`${groupName.trim()} was created with ${selectedPeople.length} members.`); setScreen('home'); setSelected([]); setGroupName(''); setGroupStep(1); }} className="flex-1 rounded-xl bg-emerald-600 py-3 font-bold text-white disabled:cursor-not-allowed disabled:opacity-40">Create group</button></div>
    </>;
    return <>
      {notice && <p className="mb-3 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">{notice}</p>}
      <SearchInput value={query} onChange={setQuery} placeholder="Search contacts by name" />
      {!query && <><p className="mb-2 mt-5 text-xs font-extrabold uppercase tracking-[0.15em] text-stone-400">Frequently contacted</p><div className="flex gap-3 overflow-x-auto pb-2">{contacts.filter((person) => person.frequent).map((person) => <button type="button" key={person.id} onClick={() => toggleSelected(person.id)} className="flex w-20 shrink-0 flex-col items-center gap-1"><Avatar person={person} selected={selected.includes(person.id)} /><span className="w-full truncate text-center text-xs font-bold text-stone-600">{person.name.split(' ')[0]}</span></button>)}</div></>}
      <p className="mb-1 mt-5 text-xs font-extrabold uppercase tracking-[0.15em] text-stone-400">All contacts</p>
      <div className="max-h-72 overflow-y-auto">{people.map((person) => <PersonRow key={person.id} person={person} selected={selected.includes(person.id)} onSelect={() => toggleSelected(person.id)} />)}</div>
      <button type="button" disabled={selected.length < 2} onClick={() => setGroupStep(2)} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 font-bold text-white disabled:cursor-not-allowed disabled:opacity-40">Next · {selected.length} selected <Icon name="chevron" className="h-4 w-4" /></button>
    </>;
  };

  const renderSent = () => <div className="space-y-1">{sentRequests.length ? sentRequests.map((person) => <PersonRow key={person.id} person={person} meta={`@${person.id} · Waiting for response`} action={<button type="button" onClick={() => setSentRequests((current) => current.filter((request) => request.id !== person.id))} className="inline-flex items-center gap-1 rounded-lg border border-rose-200 px-3 py-2 text-xs font-extrabold text-rose-600 hover:bg-rose-50"><Icon name="trash" className="h-3.5 w-3.5" /> Remove</button>} />) : <EmptyState title="No pending requests" description="Requests you send will appear here." />}</div>;
  const renderRecent = () => <div className="space-y-1">{recentFriends.length ? recentFriends.map((person) => <PersonRow key={`${person.id}-${person.added}`} person={person} meta={`Added ${person.added}`} />) : <EmptyState title="No new friends" description="Recently accepted contacts will appear here." />}</div>;
  const renderReceived = () => <><p className="mb-3 text-sm text-stone-500">People who would like to add you as a contact.</p>{notice && <p className="mb-3 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">{notice}</p>}<div className="space-y-1">{receivedRequests.length ? receivedRequests.map((person) => <PersonRow key={person.id} person={person} action={<button type="button" onClick={() => acceptRequest(person)} className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-extrabold text-white hover:bg-emerald-700">Accept</button>} />) : <EmptyState title="You're all caught up" description="New requests will appear here." />}</div></>;

  const screens = { home: renderHome, add: renderAdd, group: renderGroup, sent: renderSent, recent: renderRecent, received: renderReceived };

  return (
    <div className="fixed inset-0 z-[70] bg-stone-950/45 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="contacts-title" onMouseDown={(event) => { if (event.target === event.currentTarget) close(); }}>
      <aside className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-white shadow-2xl">
        <header className="flex items-center gap-3 border-b border-stone-100 px-5 py-4">
          {screen !== 'home' && <button type="button" onClick={() => goTo('home')} className="rounded-full p-2 text-stone-500 hover:bg-stone-100" aria-label="Back to contacts"><Icon name="back" /></button>}
          <div className="min-w-0 flex-1"><p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-600">Connect</p><h2 id="contacts-title" className="truncate text-xl font-extrabold text-stone-900">{headerTitle}</h2></div>
          <button type="button" onClick={close} className="rounded-full p-2 text-stone-500 hover:bg-stone-100" aria-label="Close contacts"><Icon name="close" /></button>
        </header>
        <div className="flex-1 overflow-y-auto p-5">{screens[screen]()}</div>
      </aside>
    </div>
  );
}
