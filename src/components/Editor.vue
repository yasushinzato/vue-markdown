<template>
  <div class="editor">
    <div class="alert alert-danger" role="alert" v-if="show === true">削除しました。</div>
    <h1>エディター画面</h1>
    <span class="mr-3">{{ user.displayName }}</span>

    <button @click="logout">ログアウト</button>
    <div class="mb-5"></div>
    <div class="memoListWrapper">
      <div
        class="memoList"
        v-for="(memo, index) in memos"
        @click="selectMemo(index)"
        :data-selected="index == selectedIndex"
      >
        <p class="memoTitle">{{ displayTitle(memo.markdown) }}</p>
      </div>
      <button class="addMemoBtn" @click="addMemo">メモの追加</button>
      <button class="deleteMemoBtn" v-if="memos.length > 1" @click="deleteMemo">選択中のメモの削除</button>
      <button class="saveMemosBtn" @click="saveMemos">メモの保存</button>
    </div>
    <div class="editorWrapper mb-5">
      <!-- <textarea class="markdown" v-model="memos[selectedIndex].markdown"></textarea> -->
      <textarea
        class="markdown"
        v-on:keydown.ctrl.78="saveMemos"
        v-model="memos[selectedIndex].markdown"
      ></textarea>
      <div class="preview markdown-body" v-html="preview()"></div>
    </div>
  </div>
</template>

<script>
import marked from "marked";

export default {
  name: "editor",
  props: ["user"],
  data() {
    return {
      show: false,
      memos: [
        {
          markdown: ""
        }
      ],
      selectedIndex: 0
    };
  },
  // ページ読み込み時にDBから値を取得する
  created: function() {
    firebase
      .database()
      .ref("memos/" + this.user.uid)
      .once("value")
      .then(result => {
        if (result.val()) {
          this.memos = result.val();
        }
      });
  },
  // コンポーネント描画完了タイミング
  mounted: function() {
    // Ctrl + S キーで保存する
    document.onkeydown = e => {
      console.log("キーイベント" + e.key);
      if (e.key == "s" && e.ctrlKey) {
        this.saveMemos();
        return false;
      }
    };
  },
  beforeDestroy: function() {
    document.onKeydown = null;
  },
  methods: {
    // 削除時のフラッシュメッセージを3秒表示
    showFlash() {
      this.show = true;
      setTimeout(() => {
        this.show = false;
      }, 3000);
    },
    logout: function() {
      firebase.auth().signOut();
    },
    preview: function() {
      return marked(this.memos[this.selectedIndex].markdown);
    },
    // 新規追加時の初期値
    addMemo: function() {
      this.memos.push({
        markdown: "# 無題のメモ"
      });
      this.selectIndex++;
    },
    selectMemo: function(index) {
      this.selectedIndex = index;
    },
    // １行目をタイトルにする。最初のh1タグの「# 」は除外する。
    displayTitle: function(text) {
      return text.split(/\n/)[0].replace(/#\s/, "");
    },
    deleteMemo: function() {
      this.memos.splice(this.selectedIndex, 1);
      if (this.selectedIndex > 0) {
        this.selectedIndex--;
      }
      this.showFlash();
    },
    // FirebaseのDBに保存する
    saveMemos: function() {
      firebase
        .database()
        .ref("memos/" + this.user.uid)
        .set(this.memos);
      alert("メッセージを保存しました。");
    }
  }
};
</script>

<style lang="scss" scoped>
.deleteMemoBtn {
  margin: 10px;
}
.memoListWrapper {
  width: 19%;
  float: left;
  border-top: 1px solid #000;
}
.memoList {
  padding: 10px;
  box-sizing: border-box;
  text-align: left;
  border-bottom: 1px solid #000;
  &:nth-child(even) {
    background-color: #ccc;
  }
  &[data-selected="true"] {
    background-color: #ccf;
  }
}
.memoTitle {
  height: 1.5em;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
}
.addMemoBtn {
  margin-top: 20px;
}
.editorWrapper {
  display: flex;
}
.markdown {
  width: 50%;
  height: 500px;
}
.preview {
  width: 50%;
  text-align: left;
}
</style>
