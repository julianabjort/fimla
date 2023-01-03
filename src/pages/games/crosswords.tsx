import { observer, useLocalObservable } from "mobx-react-lite";
import WordleStore from "../../stores/WordleStore";

const Crosswords = () => {
  const store = useLocalObservable(() => WordleStore);
  return (
    <div>
      {store.apiword}
      <button onClick={store.getWord}>Get word</button>
    </div>
  );
};

export default observer(Crosswords);
