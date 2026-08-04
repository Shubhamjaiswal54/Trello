// CardsPage.tsx
import { Draggable } from '@/components/ui/draggable'
import { Droppable } from '@/components/ui/droppable'
import { DragDropProvider } from '@dnd-kit/react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useParams } from 'react-router'

interface CardObj {
  uuid: string;
  text: string;
  pos: string;
  boardId: string;
}

// column display metadata — purely cosmetic, ids ('A'/'B'/'C') are untouched
const columnMeta: Record<string, { label: string; accent: string }> = {
  A: { label: 'To do', accent: '#5b7ea3' },
  B: { label: 'In progress', accent: '#d3944a' },
  C: { label: 'Done', accent: '#7a9b74' },
};

const CardsPage = () => {
  const targets = ['A', 'B', 'C'];
  const [items, setItems] = useState<CardObj[]>([]);
  const [name, setName] = useState('');
  const { boardId } = useParams();
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const baseUrl = `http://localhost:3000/api/cards/${boardId}`;

  const getToken = () => localStorage.getItem('token');

  useEffect(() => {
    async function getall() {
      setIsLoading(true);
      try {
        const res = await axios.get(
          `${baseUrl}/getallcards`,
          { headers: { token: getToken() } });
        setItems(res.data);
      } catch (error: any) {
        setErrorMessage('Could not load this board.');
      } finally {
        setIsLoading(false);
      }
    }
    getall();
  }, [])

  async function adderFunction() {
    if (!name.trim() || isAdding) return;

    const newCard: CardObj = {
      uuid: crypto.randomUUID(),
      text: name.trim(),
      pos: '',
      boardId: boardId!,
    };

    setIsAdding(true);
    setItems((prev) => [...prev, newCard]);
    setName('');

    try {
      await axios.post(
        `${baseUrl}/create`,
        { movedItem: newCard },
        { headers: { token: getToken() } }
      );
    } catch (error: any) {
      setItems((prev) => prev.filter((it) => it.uuid !== newCard.uuid));
      setErrorMessage(`Could not save "${newCard.text}".`);
    } finally {
      setIsAdding(false);
    }
  }

  async function savePlacement(movedItem: CardObj, previousItems: CardObj[]) {
    try {
      await axios.put(`${baseUrl}/${movedItem.uuid}`, {
        pos: movedItem.pos,
      }, { headers: { token: getToken() } });
    } catch (error: any) {
      setItems(previousItems);
      setErrorMessage(`Could not move "${movedItem.text}", reverted.`);
    }
  }

  return (
    <div className="min-h-screen bg-[#1b2129] text-[#eef1f5] px-6 py-6">

      {errorMessage && (
        <div className="mb-4 flex items-center justify-between rounded-sm border-l-2 border-[#d1495b] bg-[#2a1f22] px-4 py-2.5 text-sm text-[#f0d9dc]">
          <span>{errorMessage}</span>
          <button onClick={() => setErrorMessage(null)} className="ml-4 text-[#f0d9dc]/70 hover:text-[#f0d9dc]">
            ✕
          </button>
        </div>
      )}

      {/* toolbar */}
      <div className="flex gap-2 mb-8 max-w-md">
        <input
          type="text"
          placeholder="Add a card..."
          onChange={(e) => setName(e.target.value)}
          value={name}
          onKeyDown={(e) => e.key === 'Enter' && adderFunction()}
          className="flex-1 rounded-sm bg-[#232b36] border border-[#333d4b] px-3 py-2 text-sm text-[#eef1f5] placeholder:text-[#6b7280] focus:outline-none focus:ring-1 focus:ring-[#5b7ea3]"
        />
        <button
          onClick={adderFunction}
          disabled={isAdding}
          className="rounded-sm bg-[#5b7ea3] px-4 py-2 text-sm font-medium text-[#101418] transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {isAdding ? 'Adding…' : 'Add'}
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-2 max-w-md">
          <div className="h-10 rounded-sm bg-[#232b36] animate-pulse" />
          <div className="h-10 rounded-sm bg-[#232b36] animate-pulse" />
        </div>
      ) : (
        <DragDropProvider
          onDragEnd={(event) => {
            if (event.canceled) return;
            const itemId = event.operation.source?.id;
            const targetId = event.operation.target?.id;
            if (itemId && targetId) {
              const previousItems = items;
              const updatedCard = items.find((it) => it.uuid === String(itemId));
              if (!updatedCard) return;
              const newCard = { ...updatedCard, pos: String(targetId) };
              setItems((prevItems) =>
                prevItems.map((it) => (it.uuid === String(itemId) ? newCard : it))
              );
              savePlacement(newCard, previousItems);
            }
          }}
        >
          {/* unsorted shelf */}
          <div className="mb-6">
            <div className="mb-2 font-mono text-xs uppercase tracking-wider text-[#6b7280]">
              Unsorted · {items.filter((i) => i.pos === '').length}
            </div>
            <div className="flex gap-2 flex-wrap">
              {items
                .filter((item) => item.pos === "")
                .map((item) => (
                  <div key={item.uuid} className="w-48">
                    <Draggable id={item.uuid} itemName={item.text} />
                  </div>
                ))}
            </div>
          </div>

          {/* columns */}
          <div className="grid grid-cols-3 gap-4">
            {targets.map((targetId) => {
              const meta = columnMeta[targetId];
              const placedItems = items.filter((item) => item.pos === targetId);

              return (
                <div key={targetId} className="rounded-md bg-[#232b36] overflow-hidden">
                  <div
                    className="flex items-center justify-between px-3 py-2 font-mono text-xs uppercase tracking-wider"
                    style={{ borderBottom: `2px solid ${meta.accent}`, color: meta.accent }}
                  >
                    <span>{meta.label}</span>
                    <span>{placedItems.length}</span>
                  </div>
                  <Droppable id={targetId}>
                    {placedItems.length > 0 ? (
                      placedItems.map((item) => (
                        <Draggable key={item.uuid} id={item.uuid} itemName={item.text} />
                      ))
                    ) : (
                      <span className="text-sm text-[#6b7280] italic px-1 py-2">
                        Drop cards here
                      </span>
                    )}
                  </Droppable>
                </div>
              );
            })}
          </div>
        </DragDropProvider>
      )}
    </div>
  );
};

export default CardsPage;