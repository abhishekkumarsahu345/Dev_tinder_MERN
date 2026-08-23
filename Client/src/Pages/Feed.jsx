import React, { useCallback, useEffect, useRef, useState } from "react";
import Container from "../Components/Container";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../utils/feedSlice";
import CardDeck from "../Components/CardDeck";
import EmptyState from "../Components/EmptyState.jsx"

const Feed = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [hasMore, sethasMore] = useState(true);
  const { feed } = useSelector((state) => state.feed);
  const pageRef = useRef(1);
  const isFetching = useRef(false);
  const CARDS_PER_PAGE = 5;
  const getFeed = useCallback(async () => {
    if (isFetching.current|| !hasMore ||!feed) return;
    isFetching.current=true;
    setLoading(true);
    try {
      const res = await axios.get(
        `${BASE_URL}user/feed?page=${pageRef.current}&limit=${CARDS_PER_PAGE}`,
        {
          withCredentials: true,
        }
      );
      const newUsers = res.data.data;
      if (newUsers.length == 0) {
        sethasMore(false);
      } else {
        dispatch(addFeed(newUsers));
        pageRef.current += 1;
      }
     
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
      isFetching.current = false;
    }
  }, [hasMore, dispatch]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    getFeed();
  }, []);
 
if (!loading && feed.length === 0 && !hasMore) {
  return (
    <Container>
      <EmptyState message="No users to show right now 🙂" />
    </Container>
  );
}

  return (
    <Container>
      <CardDeck fetchMore={getFeed} loading={loading} hasMore={hasMore} />
    </Container>
  );
};

export default Feed;
