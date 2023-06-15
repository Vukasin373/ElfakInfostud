import { observer } from "mobx-react-lite";
import React from "react";
import { Menu, Header, Button } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import PostStore from "../../../app/stores/postStore";

export default observer(function PostsFilter() {
  const { postStore } = useStore();
  const {
    postStore: { predicate, setPredicate },
  } = useStore();
  return (
    <>
      <div className="forma-selektovanje-kategorije">
        <Button
          content="Svi postovi"
          onClick={() => {
            setPredicate("svi");
            //postStore.initialLoadingApprovedPosts = true;
          }}
        />
        <Button
          content="Traženje cimera"
          onClick={() => {
            setPredicate("Trazenje cimera");
            //postStore.initialLoadingApprovedPosts = true;
          }}
        />
        <Button
          content="Traženje knjiga"
          onClick={() => {
            setPredicate("Trazenje knjiga");
            //postStore.initialLoadingApprovedPosts = true;
          }}
        />
        <Button
          content="Izgubljene stvari"
          onClick={() => {
            setPredicate("Izgubljene stvari");
            //postStore.initialLoadingApprovedPosts = true;
          }}
        />
        <Button
          content="Kartica za menzu"
          onClick={() => {
            setPredicate("Kartica za menzu");
            //postStore.initialLoadingApprovedPosts = true;
          }}
        />
        <Button
          content="Traženje saradnika"
          onClick={() => {
            setPredicate("Trazenje saradnika");
            //postStore.initialLoadingApprovedPosts = true;
          }}
        />
        <Button
          content="Ostalo"
          onClick={() => {
            setPredicate("Ostalo");
            //postStore.initialLoadingApprovedPosts = true;
          }}
        />
      </div>
    </>
  );
});
