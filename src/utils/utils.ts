import {File} from '@/store/modules/file';
import Vue from 'vue';
// @ts-ignore
import config from '@/utils/config';
// @ts-ignore
import Confirm from '@/components/Common/Confirm';
// @ts-ignore
import CreatePlayListModal from '@/components/CreatePlayListModal';

// @ts-ignore
import DropdownList from '@/components/DropdownList';
import store from '@/store/index';
import {Sortable, Plugins} from '@shopify/draggable';
import SelectItem from '@/mixins/selectItem';
import SelectContainer from '@/mixins/selectContainer';


function _initCoverUrl(arr: Array<File>, path: Array<string>) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].content) {
      _initCoverUrl(arr[i].content || [], path.concat([arr[i].title]));
    } else {
      const imgUrl = `${config.coverPath}/small/${path.join('/')}/${arr[i].title}.jpg`;
      const musicUrl = `${config.musicPath}${path.join('/')}/${arr[i].title}.mp3`;

      arr[i].imgUrl = imgUrl;
      arr[i].musicUrl = musicUrl;

    }
  }
}

export function initResourceUrl(arr: Array<File>) {
  _initCoverUrl(arr, []);
}

function _convertFilesToLinearArray(arr: Array<File>, tmp: Array<File>) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].content) {
      _convertFilesToLinearArray(arr[i].content || [], tmp);
    } else {
      tmp.push(arr[i]);
    }
  }
}

export function convertFilesToLinearArray(arr: Array<File>) {
  let tmp: Array<File> = [];
  _convertFilesToLinearArray(arr, tmp);
  return tmp;
}

/**
 *
 * @param node 事件的node
 * @param target 要判断的组件自身
 * @returns {boolean}
 */
export function isInSelf(node: HTMLElement, target: HTMLElement): boolean {
  if (node === target) {
    return true;
  }
  if (node.parentNode) {
    return isInSelf(<HTMLElement>node.parentNode, target);
  } else {
    return false;
  }
}


export function guid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

interface confirmConfig {
  title: string,
  info: string,
  onCancel?: Function
}

export function confirm(opt: confirmConfig) {
  return new Promise(((resolve, reject) => {
    let confirm = Vue.extend(Confirm);
    let contain = document.createElement('div');
    document.body.appendChild(contain);

    function remove() {
      vm.$destroy();
      document.body.removeChild(vm.$el);
    }

    var vm = new confirm({
      el: contain,
      propsData: {
        cb: () => {
          // @ts-ignore
          vm.show = false;
          setTimeout(() => {
            remove();
          }, 3000);
          resolve();
        },
        cancel: () => {
          // @ts-ignore
          vm.show = false;
          setTimeout(() => {
            remove();
          }, 3000);

          if (opt.onCancel) {
            opt.onCancel();
          }
          // reject()
        },
        ...opt
      },
    });
    // @ts-ignore
    vm.show = true;
  }));
}

/*interface editPlayListModalConfig {
  isRename?: boolean,
  oldName?: string
  onCancel?: Function
}*/

interface editPlayListModalConfig {
  isRename?: boolean
  oldName?: string
  onCancel?: Function
}

export function editPlayListModal(opt?: editPlayListModalConfig) {
  if (!opt) {
    opt = {};
  }
  return new Promise(((resolve, reject) => {
    let contain = document.createElement('div');
    document.body.appendChild(contain);

    function remove() {
      vm.$destroy();
      document.body.removeChild(vm.$el);
    }

    var vm = new CreatePlayListModal({
      el: contain,
      store,
      propsData: {
        cb: (name: string) => {
          // @ts-ignore
          vm.show = false;
          setTimeout(() => {
            remove();
          }, 3000);
          resolve(name);
        },
        cancel: () => {
          // @ts-ignore
          vm.show = false;
          setTimeout(() => {
            remove();
          }, 3000);
          if (opt!.onCancel) {

            // @ts-ignore
            opt!.onCancel();
          }
        },
        ...opt
      },
    });
    // @ts-ignore
    vm.show = true;
  }));
}


export interface DropDownMenuItem {
  label?: string,
  callback?: Function,
  split?: boolean,
  isDisable?: boolean
}


export function dropDownMenu(e: Event, opts: Array<DropDownMenuItem>, onCancel?: Function) {   // 传递{split:true}为分割线
  let contain = document.createElement('div');
  document.body.appendChild(contain);

  function remove() {
    vm.$destroy();
    document.body.removeChild(vm.$el);
  }

  var vm = new DropdownList({
    el: contain,
    propsData: {
      e,
      items: opts,
      remove
    },
  });
  // @ts-ignore
  vm.show = true;
}

export function union(arr1: Array<any>, arr2: Array<any>) {
  var arr = [];
  for (let i = 0; i < arr1.length; i++) {
    if (arr.indexOf(arr1[i]) === -1) {
      arr.push(arr1[i]);
    }
  }
  for (let i = 0; i < arr2.length; i++) {
    if (arr.indexOf(arr2[i]) === -1) {
      arr.push(arr2[i]);
    }
  }
  return arr;
}


export function unionFiles(arr1: Array<File>, arr2: Array<File>) {
  var arr = [];
  for (let i = 0; i < arr1.length; i++) {
    if (arr.findIndex(o => o.id === arr1[i].id) === -1) {
      arr.push(arr1[i]);
    }
  }
  for (let i = 0; i < arr2.length; i++) {
    if (arr.findIndex(o => o.id === arr2[i].id) === -1) {
      arr.push(arr2[i]);
    }
  }
  return arr;
}


export function toggleFullScreen() {
  var document: any = window.document;
  const el = document.body;
  const isFullscreen = document.fullScreen || document['mozFullScreen'] || document.webkitIsFullScreen;
  if (!isFullscreen) {//进入全屏,多重短路表达式
    (el.requestFullscreen && el.requestFullscreen()) ||
    (el['mozRequestFullScreen'] && el['mozRequestFullScreen']()) ||
    (el.webkitRequestFullscreen && el.webkitRequestFullscreen()) || (el['msRequestFullscreen'] && el['msRequestFullscreen']());

  } else {	//退出全屏,三目运算符
    document.exitFullscreen ? document.exitFullscreen() :
      document['mozCancelFullScreen'] ? document['mozCancelFullScreen']() :
        document.webkitExitFullscreen ? document.webkitExitFullscreen() : '';
  }
}

export function fadeInFileContent() {
  const content = <HTMLElement> document.querySelector('.Files>.content');
  content.className = 'content';
  // content.style.opacity = '0'
  content.style.visibility = 'hidden';
  setTimeout(() => {
    // content.style.opacity = '1'
    content.style.visibility = 'visible';

    content.className = 'content fade-in';
  });
}


export function getAllFileByContent(content: Array<File>): Array<File> {
  let tmp: Array<File> = [];

  function pushItem(content: Array<File>) {
    for (let i = 0; i < content.length; i++) {
      if (content[i].content) {
        pushItem(content[i].content);
      } else {
        tmp.push(content[i]);
      }
    }
  }

  pushItem(content);
  return tmp;
}

export function getAddFileToContextMenuItems(files: Array<File>, context?: SelectContainer) {
  const contextMenu: any = [];
  files = getAllFileByContent(files);
  contextMenu.push({
    label: '正在播放',
    callback: () => {
      store.dispatch('playList/addToPlayingList', files);
      if (context) {
        context.selectedItems = [];
      }
    }
  });
  contextMenu.push({split: true});

  contextMenu.push({
    label: '新的播放列表', callback: () => {
      editPlayListModal().then(name => {
        store.dispatch('playList/createPlayList', {name, fileIds: files.map(o => o.id)});
        if (context) {
          context.selectedItems = [];
        }
      });
    }
  });

  const playLists = store.state.playList.playLists;

  if (playLists.length > 0) {
    contextMenu.push({split: true});
    playLists.forEach(o => {
      contextMenu.push({
        label: o.title,
        callback: () => {
          store.dispatch('playList/addToPlayList', {
            listId: o.id,
            ids: files.map(o => o.id)
          });
          if (context) {
            context.selectedItems = [];
          }
        }
      });
    });
  }

  return contextMenu;
}


export function mapIdsToFiles(ids: Array<number>): Array<File> {
  // return store.state.file.allFile.filter(o => ids.indexOf(o.id) !== -1);
  var res: Array<File> = [];
  const allFile = store.state.file.allFile;
  ids.forEach(id => {
    res.push(allFile.find(o => o.id === id)||new File());
  });
  return res;
}

export interface SortListHack {
  onStart?: Function
  onSort?: Function
  onEnd?: Function
}

export function SortList(container: HTMLElement, hacks: SortListHack, opt?: any) {
  const {onStart, onSort, onEnd} = hacks;
  if (!opt) {
    opt = {
      draggable: 'li',
      // delay:300,
      swapAnimation: {
        duration: 200,
        easingFunction: 'ease-in-out',
        horizontal: true
      },
      plugins: [Plugins.SwapAnimation]
    };
  }
  const sortable = new Sortable(container, opt);
  if (onStart) sortable.on('sortable:start', onStart);
  if (onSort) sortable.on('sortable:sort', onSort);
  if (onEnd) sortable.on('sortable:stop', onEnd);
}

export function playAllFile(context: SelectContainer, files: Array<File>) {
  files.sort(function (e1, e2) {
    if (e1.trck > e2.trck) return 1;
    if (e1.trck < e2.trck) return -1;
    return 0;
  });
  context.$store.dispatch('file/playDirs', context.selectedItems);
  context.selectedItems = [];
}

export function addFileToPlayList(context: SelectContainer, ids: Array<number>, listId: string) {
  context.$store.dispatch('playList/addToPlayList', {listId, ids});
}