let zIndex = 2000;
let highers = [];
let higherZIndex = 100000;

export function nextZIndex() {
  return highers && highers.length ? ++higherZIndex : ++zIndex;
}

export function pushItem(item = 'item') {
  highers.push(item);
}

export function popItem() {
  highers.pop();
}

export default {
  data() {
    return {
      zIndex: nextZIndex()
    };
  },
  methods: {
    nextZIndex() {
      this.zIndex = nextZIndex();
    },
    updateZIndex() {
      this.zIndex = highers && highers.length ? higherZIndex : zIndex;
    }
  }
};
