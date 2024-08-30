import styles from '../../../../styles/Chat.module.css';
import { useFilters } from '@/src/hooks/useChatFilter';

export default function ChatFilters() {
  const { setFilters, filterInitialState } = useFilters();

  return (
    <>
      <div className={styles.Filters}>
        <button onClick={() => setFilters(filterInitialState)}>Todos</button>
        <button
          onClick={() =>
            setFilters((prevState) => ({ ...prevState, not_read: true }))
          }
        >
          No leídos
        </button>
        <button
          onClick={() =>
            setFilters((prevState) => ({ ...prevState, type: 'Group' }))
          }
        >
          Grupos
        </button>
      </div>
    </>
  );
}
