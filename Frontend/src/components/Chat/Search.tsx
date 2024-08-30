import { useForm } from 'react-hook-form';
import styles from '../../../styles/Chat.module.css';
import Image from 'next/image';
import { debounce } from 'lodash';
import serchIcon from '../../assets/search.svg';

interface Props {
  onSearch: (searchTerm: string) => void;
}

const debouncedSearch = debounce(
  (searchTerm: string, onSearch: (searchTerm: string) => void) => {
    onSearch(searchTerm);
  },
  300
);

export default function Search({ onSearch }: Props) {
  const { register } = useForm();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const searchTerm = event.target.value;
    debouncedSearch(searchTerm, onSearch);

  };

  return (
    <div className={styles.Search}>
      <form className={styles.SearchContent}>
        <Image src={serchIcon} alt="search" width={15} height={15} />
        <input
          type="text"
          placeholder="Buscar"
          {...register('search', {
            onChange: (e) => handleChange(e),
          })}
        />
      </form>
    </div>
  );
}
