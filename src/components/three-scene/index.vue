<template>
  <div class="three-scene" ref="three-scene" onselectstart="return false;">
    <div
      @pointerdown="
        (e) => {
          // e.preventDefault();
          e.stopPropagation();
        }
      "
      class="btn"
    >
      <div class="oth">
        <input type="number" v-model="peoPleNumber" />
        <button
          v-for="(item, index) in shopList"
          @pointerdown="shopPeopleIn(item)"
        >
          {{ item }}人进入
        </button>
        <button
          v-for="(item, index) in shopList"
          @pointerdown="shopPeopleOut(item)"
        >
          {{ item }}人出来
        </button>
        <input type="number" v-model="towerPeopleNumber" />
        <button @pointerdown="towerPeopleApper">塔人物出现</button>
        <button @pointerdown="towerPeopleDisapper">塔人物消失</button>
        <button
          v-for="(item, index) in lightList"
          @pointerdown="lightOpen(item)"
        >
          {{ item }}开灯
        </button>
        <button
          v-for="(item, index) in lightList"
          @pointerdown="lightClose(item)"
        >
          {{ item }}关灯
        </button>

        <button
          @click="
            () => {
              goldCoin(1, true);
            }
          "
        >
          金币1
        </button>

        <button @click="niangHuaiTang">拈花堂</button>
        <button @click="guangCangDeng">广场亮灯</button>
        <button @click="shangPuDeng">商铺亮灯</button>

        <button @click="flowerAnima">莲花动画</button>

        <button @click="kongMingAnima">孔明灯动画</button>

        <button @click="lotusBgc">荷花背景</button>

        <button @click="showTree">树</button>

        <button @click="bubbleEvents">水泡</button>

        <button @click="isShowLightBeam">光束开启关闭</button>

        <button @click="focusTower">塔聚焦</button>
        <input type="number" v-model="r" />
        <input type="number" v-model="g" />
        <input type="number" v-model="b" />
        <button v-for="(item, indiex) in lightList" @click="setColor(item)">
          {{ item }}光
        </button>
        <!-- 拈花堂灯光 -->
        <input type="number" v-model="NHTr">
        <input type="number" v-model="NHTg">
        <input type="number" v-model="NHTb">
        <button @click="setNHTColor">拈花堂灯光</button>
      </div>
      <div
        class="goldBorder"
        v-for="(border, index) in shopList"
        :class="`${border}金币`"
      ></div>
    </div>
  </div>
</template>

<script>
import Change from "./Change";
import { RunScene, Utils } from "run-scene-v2";
import Stats from "three/examples/jsm/libs/stats.module";

// 场景的传值Bus
export default {
  data() {
    return {
      r: 0,
      g: 0,
      b: 0,
      NHTr:0,
      NHTg:0,
      NHTb:0,
      change: null,
      runScene: null,
      peoPleNumber: null,
      shopList: ["商铺1", "商铺2", "商铺3", "商铺4", "商铺5"],
      towerPeopleNumber: null,
      lightList: ["1楼", "2楼", "3楼", "4楼", "5楼", "顶楼"],
      isShowLotusBgc: true,
      kongMingLight: true,
      isShowTree: true,
      isShowFlower: true,
      niangHuaiTangEvents: true,  
      guangCangDengEvents: true,
      shangPuDengEvents: true,
      bubble: true,
      isShowRadial: true,
    };
  },
  mounted() {
    // 加载场景
    this.loadScene();
    // 打印点击的模型接口
    // bus.$on("logClickModel", this.logClickModel);
    // this.proxyMsg();
  },
  methods: {
    // 加载场景
    loadScene() {
      this.runScene = new RunScene({
        // path: "./assets/scene2.glb",
        path: "https://test2-1303915342.cos.ap-shanghai.myqcloud.com/nhw/scene.glb",
        rootDom: this.$refs["three-scene"],
        options: {
          // render2: true, 
          // render3: true,
          texture: {
            // load: false,
            lazyload:{
                 open:true,
                 IntervalTime : 16.6
              },
          },
          /**
            msg?: {
            是否显示打印，默认显示
              show: boolean = true
             显示打印的等级 默认显示基础打印
              level: "base" | 'detail' =  base
              }
             是否渲染
              run?: boolean = true
             decode 的路径
              decodePath?: string = ./draco/
             是否显示fps 默认关
              showFps?: boolean = false
             是否延迟加载 默认不延迟
              loadInterval?: number = 0
             模式 默认运行模式
              mode?: 'editor' | 'debug' | 'running' = 'running
             texture?:{
             是否加载贴图
               load?:boolean = true
               lazyload?:{
             是否懒加载贴图 默认是
                 open?:boolean = false,
             懒加载的时间区间 默认为16.0ms
                 IntervalTime?:number = 16.6
              },
             贴图质量 可大幅度降低显存占用 0-1 之间
              quality?:number = 1
             }
             是否加载实例后的模型 节省性能 默认关闭
              instanceClone?: boolean =false
             2drenderer
              render2?: boolean = false
             3drenderer
              render3?: boolean, = false
               */
        },
      }).on("complete", () => {
        return 
        this.onDone();
        this.runScene.assetsEx.scene.children.map((i) => {
          i.castShadow = false;
          // if (i.isLight) this.runScene.modelEx.remove(i);
        });
        // this.runScene.assetsEx.scene.traverse((i) => {
        //   i.matrixAutoUpdate = false;
        //   // i.matrixWorldNeedsUpdate = false;
        // });
      });
      this.change = new Change(this.runScene);
      console.log(this.runScene, "this.runScene");
    },
    onDone() {
      console.log("场景加载完毕~");
      // this.stats = Stats();
      // this.stats.domElement.style.position = "absolute";
      // this.stats.domElement.style.top = "50px";
      // this.runScene.assetsEx.engineDom.appendChild(this.stats.domElement);
      // this.runScene.cb.render.add("stats", () => {
      //   this.stats.update();
      // });
    },
    focusTower() {
      this.change.towerEvent.focusTower();
    },
    isShowLightBeam() {
      this.change.radial.isShow();
    },
    niangHuaiTang() {
      this.change.squareLight.niangHuaiTangEvents(this.niangHuaiTangEvents);
      this.niangHuaiTangEvents = !this.niangHuaiTangEvents;
    },
    guangCangDeng() {
      this.change.squareLight.guangCangDengEvents(this.guangCangDengEvents);
      this.guangCangDengEvents = !this.guangCangDengEvents;
    },
    shangPuDeng() {
      this.change.squareLight.shangPuDengEvents(this.shangPuDengEvents);
      this.shangPuDengEvents = !this.shangPuDengEvents;
    },
    bubbleEvents() {
      const cb = () => {
        console.log("气泡回调");
      };
      this.change.bubble.events(this.bubble, cb);
      this.bubble = !this.bubble;
    },
    showTree() {
      this.change.tree.anima(this.isShowTree);
      this.isShowTree = !this.isShowTree;
    },
    lotusBgc() {
      const cb = () => {
        console.log("莲花背景结束");
      };
      this.change.lotusBgc.isShow(this.isShowLotusBgc, cb, 2);
      this.isShowLotusBgc = !this.isShowLotusBgc;
    },
    // 莲花动画
    flowerAnima() {
      // 结束回调
      const cb = () => {
        console.log("莲花动画结束");
      };
      this.change.flower.show(this.isShowFlower, cb);
      this.isShowFlower = !this.isShowFlower;
    },
    // 孔明灯
    async kongMingAnima() {
      const cb = () => {
        console.log("孔明灯回调");
      };
      await this.change.kongMingLight.anima(cb);
    },
    // 打印点击到的模型
    logClickModel(model) {
      console.log("点击的模型为:", model.name);
    },
    shopPeopleIn(shop) {
      this.change.shopEvent.createPeopleToShop(this.peoPleNumber, shop, 1);
    },
    shopPeopleOut(shop) {
      this.change.shopEvent.createPeopleToShop(this.peoPleNumber, shop, 2);
    },
    towerPeopleApper() {
      this.change.towerEvent.peopleApper(this.towerPeopleNumber);
    },
    towerPeopleDisapper() {
      this.change.towerEvent.peopleDisapper(this.towerPeopleNumber);
    },
    lightOpen(floor) {
      this.change.towerEvent.lightControl(floor, true);
    },
    lightClose(floor) {
      this.change.towerEvent.lightControl(floor, false);
    },
    // 金币显示隐藏
    goldCoin(shopId, isShow) {
      let dom = document.querySelector(`.商铺${shopId}金币`);
      dom.classList[isShow ? `remove` : `add`]("none");
      dom.classList[isShow ? `add` : `remove`]("show");
    },
    //设置颜色
    setColor(floor) {
      this.change.towerEvent.setLight(floor, this.r, this.g, this.b);
    },
    setNHTColor(){
      this.change.squareLight.setNHTlight(this.NHTr,this.NHTg,this.NHTb);
    }
  },
};
</script>

<style lang="less" scoped>
.three-scene {
  width: 100vw;
  height: 100vh;
  // > button {
  //   position: absolute;
  //   z-index: 2;
  // }
  .oth {
    position: absolute;
    z-index: 2;
  }
  .goldBorder {
    position: absolute;
    z-index: 10;
    width: 50px;
    height: 50px;
    background-color: red;
    opacity: 0;
    background: url("../../../public/assets/Glod.png") repeat;
    background-size: 100% 100%;
  }
  .show {
    opacity: 1 !important;
  }

  .none {
    opacity: 0 !important;
  }
}
</style>
