// const console = {
//   log: () => { }
// }

import * as THREE from "three";
import { Utils } from "run-scene-v2";
import { MTNhw } from "./MTNhw";
// import VConsole from "vconsole";
// 声明变量
let camera, scene, controls, renderer2, renderer, dom, t, p, runScene;

const { getRes, getMacro } = Utils;
// 拿资源
const setAssets = (assets) => {
  camera = assets.camera;
  scene = assets.scene;
  controls = assets.controls;
  renderer = assets.renderer;
  dom = assets.engineDom;
  t = assets.t;
  // renderer2 = assets.renderer2;
  // p = assets.p;
};

// 整体场景事件
function Change(runScene) {
  /* 拿资源 分解资源
        this挂载至t上
        runScene上的其他Api可以直接runScene.直接使用
    */
  setAssets({ ...runScene.assetsEx.get(), t: this, runScene });

  // 挂载runScene
  t.runScene = runScene;

  // this.vConsole = new VConsole();

  this.events = new Events();

  this.methods = new Methods();

  this.cloneEvent = new CloneEvent();

  this.shopEvent = new ShopEvent();

  this.towerEvent = new TowerEvent();

  this.flower = new Flower();

  this.radial = new Radial();

  this.kongMingLight = new KongMingLight();

  this.lotusBgc = new LotusBgc();

  this.tree = new Tree();

  this.bubble = new Bubble();

  this.squareLight = new SquareLight();

  // 基本的场景配置
  controls.maxPolarAngle = Math.PI / 2 - 0.2;

  controls.screenSpacePanning = false;

  // 加载结束
  runScene.on("lazyLoadedTexture", () => { });

  runScene.on("complete", async () => {
    t.methods.camAnima({
      cx: 260.597805358153,
      cy: 199.3290531627542,
      cz: -468.8160824861443,
      tx: 381.44877055009533,
      ty: 174.72728011528125,
      tz: -479.9673729494797,
    });

    await this.flower.init();

    this.shopEvent.init();

    this.towerEvent.init();

    this.shopEvent.createGoldBorder();

    this.radial.init();

    this.kongMingLight.init();

    this.lotusBgc.init();

    this.bubble.init();

    this.squareLight.init();

    const tree = t.runScene.modelEx.getModel("group38_shugan1");

    const lightBall = t.runScene.modelEx.getModel("修光球");

    this.mtnhw = new MTNhw({ camera, scene, renderer }, { tree, lightBall });

    // console.log(this.mtnhw.treeMaterial.uniforms.progress);
    // console.log(this.mtnhw.lightBallMesh.material.opacity);

    // 默认设置为不透明
    this.mtnhw.lightBallMesh.material.opacity = 0;
    this.mtnhw.treeMaterial.uniforms.progress.value = 1;

    this.clock = new THREE.Clock();

    const timer = setTimeout(() => {
      // runScene.bloom.glow.bloomParams.isBloom = false;
      clearTimeout(timer);
    }, 1000);

    t.runScene.cb.render.add("flowerRotate", () => {
      t.flower.flower && (t.flower.flower.rotation.y += 0.01);
      // this.mtnhw && this.mtnhw.update();
    });
  });

  // 销毁
  this.dispose = () => runScene.dispose();
}

//方法
class Methods {
  //获取模型
  getModel(name) {
    return t.runScene.modelEx.getModel(name);
  }
  //相机动画
  camAnima(view, time, callback) {
    t.runScene.modelEx.camAnima(
      t.runScene.modelEx.getCamLocal(),
      view,
      time,
      () => {
        callback && callback();
      }
    );
  }
  //场景自转
  autoRotation(isRotate, speed, lookat) {
    t.runScene.assetsEx.controls.autoRotate = isRotate;
    t.runScene.assetsEx.controls.autoRotateSpeed = speed;
    lookat && t.runScene.camera.lookAt(lookat.x, lookat.y, lookat.z);
  }
  //开启辉光
  light(model, isOpen) {
    t.runScene.modelEx.setGlow(model, isOpen);
  }
}

//克隆事件
class CloneEvent {
  constructor() { }
  //克隆模型
  copyModel(model) {
    const copyModel = t.runScene.modelEx.clone(model);
    return copyModel;
  }
  //设置属性并添加至场景
  setCopyModelProperty(copyModel, Property) {
    copyModel.visible = Property.visible;
    copyModel.position.set(
      Property.position.x,
      Property.position.y,
      Property.position.z
    );
    copyModel.material = copyModel.material.clone();
    copyModel.material.transparent = true;
    copyModel.material.opacity = Property.opacity;
    t.runScene.modelEx.add(copyModel);
  }
  //删除模型
  clearCopyModel(copyModel) {
    t.runScene.modelEx.remove(copyModel);
  }
}

//商铺事件
class ShopEvent {
  constructor() { }
  
  shopMap;
  cloneModel;
  //初始化
  init() {
    console.log(t.runScene);
    this.cloneModel = t.methods.getModel("SP人");
    this.cloneModel.visible = false;
    this.shopMap = {
      商铺1: {
        borderPosition: t.methods.getModel("商铺1"),
        rangePosition: { x: 678.6546835703366, y: 2.4338684543174005 },
        beginZ: -19.249096344726695,
        endZ: 43.28590330612664,
        doorPosition: {
          x: 715.348489344153,
          y: 2.4338684543174005,
          z: -2.304479250308624,
        },
      },
      商铺2: {
        borderPosition: t.methods.getModel("商铺2"),
        rangePosition: { x: 678.6546835703366, y: 2.4338684543174005 },
        beginZ: -97.90748487526992,
        endZ: -29.948062302714305,
        doorPosition: {
          x: 715.348489344153,
          y: 2.4338684543174005,
          z: -54.87039269263238,
        },
      },
      商铺3: {
        borderPosition: t.methods.getModel("商铺3"),
        rangePosition: { x: 678.6546835703366, y: 2.4338684543174005 },
        beginZ: -269.4245635718405,
        endZ: -118.81279417207509,
        doorPosition: {
          x: 723.711786090452,
          y: 2.4338684543174005,
          z: -164.83815329826535,
        },
      },
      商铺4: {
        borderPosition: t.methods.getModel("商铺4"),
        rangePosition: { x: 678.6546835703366, y: 2.4338684543174005 },
        beginZ: -488.590102485558,
        endZ: -295.1254954925516,
        doorPosition: {
          x: 728.0633357623165,
          y: 2.4338684543174005,
          z: -371.1869252100583,
        },
      },
      商铺5: {
        borderPosition: t.methods.getModel("商铺5"),
        rangePosition: { x: 678.6546835703366, y: 2.4338684543174005 },
        beginZ: -790.1440452896151,
        endZ: -538.4303428427537,
        doorPosition: {
          x: 735.1260245065873,
          y: 2.4338684543174005,
          z: -691.1992070890307,
        },
      },
    };
  }
  //生成随机范围
  getRandomRangePosition(Max, Min) {
    return Math.random() * (Max - Min) + Min;
  }
  //生成第二条路径
  setSecondRoad(shop) {
    return {
      x:
        (this.shopMap[shop].rangePosition.x +
          this.shopMap[shop].doorPosition.x) /
        2,
      y: this.shopMap[shop].rangePosition.y,
      z: this.getRandomRangePosition(
        this.shopMap[shop].endZ,
        this.shopMap[shop].beginZ
      ),
    };
  }
  //人出现进入店铺后消失
  async createPeopleToShop(number, shop, dir) {
    for (let i = 0; i < number; i++) {
      let person = t.cloneEvent.copyModel(this.cloneModel);
      t.cloneEvent.setCopyModelProperty(person, {
        visible: true,
        position: {
          x:
            dir == 1
              ? this.shopMap[shop].rangePosition.x
              : this.shopMap[shop].doorPosition.x,
          y:
            dir == 1
              ? this.shopMap[shop].rangePosition.y
              : this.shopMap[shop].doorPosition.y,
          z:
            dir == 1
              ? this.getRandomRangePosition(
                this.shopMap[shop].endZ,
                this.shopMap[shop].beginZ
              )
              : this.shopMap[shop].doorPosition.z,
        },
        opacity: 0,
      });
      await new Promise((s) => {
        Utils.anima(
          {
            opc: 0,
          },
          {
            opc: 1,
          },
          0.5,
          (data) => {
            person.material.opacity = data.opc;
          },
          async () => {
            s();
            let x =
              this.setSecondRoad(shop).x + this.getRandomRangePosition(-10, 8);
            let secondTime =
              Math.abs(person.position.z - this.shopMap[shop].doorPosition.z) /
              20;
            await this.personMove(
              person,
              x,
              person.position.y,
              person.position.z,
              1.5
            );
            let oldZ = person.rotation.y;
            await this.personTurnAround(person, 0);
            await this.personMove(
              person,
              person.position.x,
              person.position.y,
              dir == 1
                ? this.shopMap[shop].doorPosition.z
                : this.getRandomRangePosition(
                  this.shopMap[shop].endZ,
                  this.shopMap[shop].beginZ
                ),
              dir == 1 ? secondTime : 1.5
            );
            await this.personTurnAround(person, oldZ);
            await this.personMove(
              person,
              dir == 1
                ? this.shopMap[shop].doorPosition.x
                : this.shopMap[shop].rangePosition.x,
              dir == 1
                ? this.shopMap[shop].doorPosition.y
                : this.shopMap[shop].rangePosition.y,
              dir == 1 ? this.shopMap[shop].doorPosition.z : person.position.z,
              1
            );
            await this.personAppear(person, 0);
            t.cloneEvent.clearCopyModel(person);
          }
        );
      });
      // await this.personAppear(person, 1);
    }
  }
  //移动
  personMove(model, x, y, z, time) {
    return new Promise((s) => {
      Utils.anima(
        {
          x: model.position.x,
          y: model.position.y,
          z: model.position.z,
        },
        {
          x: x,
          y: y,
          z: z,
        },
        time,
        (data) => {
          model.position.x = data.x;
          model.position.y = data.y;
          model.position.z = data.z;
        },
        () => {
          s();
        }
      );
    });
  }
  //人转身
  personTurnAround(model, toZ) {
    return new Promise((s) => {
      Utils.anima(
        {
          y: model.rotation.y,
        },
        {
          y: toZ,
        },
        0.5,
        (data) => {
          model.rotation.y = data.y;
        },
        () => {
          s();
        }
      );
    });
  }
  //人出现消失
  personAppear(model, opc) {
    return new Promise((s) => {
      Utils.anima(
        {
          opc: model.material.opacity,
        },
        {
          opc: opc,
        },
        0.5,
        (data) => {
          model.material.opacity = data.opc;
        },
        () => {
          s();
        }
      );
    });
  }
  //生成金币看板
  createGoldBorder() {
    Object.keys(this.shopMap).map((i) => {
      // console.log(this.shopMap[i].borderPosition);
      let dom = document.querySelector(`.${i}金币`);
      getMacro(() => {
        // dom.classList.add("show");
        dom.classList.add("none");
      }, 500);
      let sprite = Utils.domTo3DSprite(dom);
      sprite.position.y += 100;
      this.shopMap[i].borderPosition.add(sprite);
    });
  }
}

//塔事件
class TowerEvent {
  constructor() { }
  cloneModel;
  peopleArray = [];
  lightMap = {};
  oldColor = {}
  init() {
    this.cloneModel = t.methods.getModel("ren_0");
    this.lightMap = {
      "1楼": t.methods.getModel("TaLight_1F"),
      "2楼": t.methods.getModel("TaLight_2F"),
      "3楼": t.methods.getModel("TaLight_3F"),
      "4楼": t.methods.getModel("TaLight_4F"),
      "5楼": t.methods.getModel("TaLight_5F"),
      顶楼: t.methods.getModel("Ding"),
    };
    Object.values(this.lightMap).map(i => {
      i.children.map(op => {
        op.material = op.material.clone();
      })
    })
    Object.keys(this.lightMap).map(i => {
      if (i == '顶楼') {
        this.oldColor['顶楼'] = this.lightMap['顶楼'].material.emissive
      } else {
        this.lightMap[i].children.map(op => {
          this.oldColor[op.name] = op.material.emissive
        })
      }
    })
    console.log(this.lightMap, "lightMap");
  }
  //人异步出现
  asyncApper() {
    return new Promise((s) => {
      let copyPerson = t.cloneEvent.copyModel(this.cloneModel);
      let x =
        Math.random() * (667.0088975117958 - 446.2797211064844) +
        446.2797211064844;
      let z =
        Math.random() * (-473.85379186803544 - -641.029637905563) +
        -641.029637905563;
      if (z <= -603 && z >= -686 && x <= 633 && x >= 527) {
        x = 527 || 633;
        z = -603 || -686;
      }
      t.cloneEvent.setCopyModelProperty(copyPerson, {
        visible: true,
        position: {
          x: x,
          y: 0,
          z: z,
        },
        opacity: 0,
      });
      copyPerson.lookAt(581.4321928755762, 0, -702.6268867583516);
      this.peopleArray.push(copyPerson);
      Utils.anima(
        {
          opc: 0,
        },
        {
          opc: 1,
        },
        0.2,
        (data) => {
          copyPerson.material.opacity = data.opc;
        },
        () => {
          s();
        }
      );
    });
  }
  //人异步消失
  asyncDisapper(person) {
    return new Promise((s) => {
      Utils.anima(
        {
          opc: 1,
        },
        {
          opc: 0,
        },
        0.2,
        (data) => {
          person.material.opacity = data.opc;
        },
        () => {
          t.cloneEvent.clearCopyModel(person);
          s();
        }
      );
    });
  }
  //人出现
  async peopleApper(num) {
    if (num >= 20) num = 20;
    for (let i = 0; i < num; i++) {
      await this.asyncApper();
    }
  }
  focusTower() {
    t.methods.camAnima(
      {
        cx: 260.597805358153,
        cy: 199.3290531627542,
        cz: -468.8160824861443,
        tx: 381.44877055009533,
        ty: 174.72728011528125,
        tz: -479.9673729494797,
      },
      1.5
    );
  }
  //人消失
  async peopleDisapper(num) {
    if (num >= this.peopleArray.length) num = this.peopleArray.length;
    if (num == 0) return;
    for (let i = 0; i < num; i++) {
      await this.asyncDisapper(this.peopleArray[0]);
      this.peopleArray.splice(0, 1);
    }
  }
  //灯开启关闭
  lightControl(floor, isOpen) {
    this.lightMap[floor].visible = isOpen;
  }
  //灯颜色
  setLight(floor, r, g, b) {
    // new THREE.Color(1, 1, 1)
    // new THREE.Color('rgb(255,255,255)')
    // new THREE.Color('white')
    if (floor == '顶楼') {
      this.lightMap[floor].material.emissive = new THREE.Color(`rgb(${r},${g},${b})`)
    } else {
      this.lightMap[floor].children.map((i) => {
        i.material.emissive = new THREE.Color(`rgb(${r},${g},${b})`)
      });
    }
  }
  //恢复颜色
  // resetColor(){
  //   Object.keys(this.lightMap).map(floor=>{
  //     if(floor == '顶楼'){
  //       this.lightMap['顶楼'].emissive = this.oldColor['顶楼']
  //     }else{
  //       this.lightMap
  //     }
  //   })
  // }
}

// 莲花(骨骼动画) lotus---荷花
class Flower {
  // glb加载器
  glbLoader = t.runScene.loaderer.gltf;
  // fbx加载器
  fbxLoader = t.runScene.fileEx;
  // 莲花
  flower = null;

  async init() {
    const { material } = await this.loadGlb();
    const flower = await this.loadFbx("./assets/flowerAnima.fbx", material);
    // t.runScene.anima.setModelAnimaNames(flower, ["flower"]);
    // t.runScene.anima.play(flower,)
    console.log(flower,"flower"); 
    t.runScene.modelEx.add(flower);
    this.flower = flower;
    this.flower.visible = false;
    this.flower.position.set(
      582.1630877495076,
      318.1238684195186,
      -742.0680735984594
    );

    this.flower.traverse((m) => {
      if (m.type === "Group") return;
      if (m.type === "Object3D") return;
      m.material.transparent = true;
      m.material.opacity = 0.07;
    });
  }

  _loadGlb(models) {
    if (models.length === 1) return models[0];
    const group = new THREE.Group();
    group.add(...models);
    return group;
  }

  async loadGlb() {
    const models = await this.glbLoader.load(`./assets/flowerMaterial.glb`, {
      addToScene: false,
      triggerCb: false,
    });
    const model = this._loadGlb(models);
    model.name = `莲花材质`;
    return model;
  }

  async loadFbx(url, material) {
    const res = this.fbxLoader.parses.fbx.parse(await getRes(url), "");
    res.traverse((m) => {
      t.runScene.modelEx.setGlow(m, true);
      if (m.material) {
        m.material = t.runScene.materialEx.create();
        m.material = material.clone();
        m.material.needsUpdate = true;
        m.material.transparent = true;
        m.material.opacity = 0;
      }
    });
    return t.runScene.sceneEx.cleanUnlessLevel(res);
  }

  async show(isShow, cb) {
    if (isShow) {
      t.events.showAnima({
        model: this.flower,
        isShow,
        time: 4,
        opacity: 0.07,
      });
      // 关闭动画
      t.runScene.anima.close("flower");
      t.runScene.anima.play("flower", {
        // loop: false,
        // lastFrame: false,
        onFinished() {
          cb();
        },
      });
    } else {
      t.events.showAnima({
        model: this.flower,
        isShow: false,
        time: 2,
        opacity: 0.07,
        cb: () => {
          cb();
          t.runScene.anima.close("flower");
        },
      });
    }
  }
}

// 射线
class Radial {
  // 射线信息
  sheDengMap = null;

  init() {
    // 赋予信息
    this.sheDengMap = {
      Shedeng1: {
        model: t.methods.getModel("Shedeng1"),
        rotation: {
          x: 99.42819143073471,
          y: -2.8734593602424665,
          z: 166.82574475465094,
        },
        time: 1000,
      },
      Shedeng1_0: {
        model: t.methods.getModel("Shedeng1_0"),
        rotation: {
          x: 90.3934209371448,
          y: 17.73703333007011,
          z: -109.30617576220645,
        },
        time: 1000,
      },
      Shedeng1_1: {
        model: t.methods.getModel("Shedeng1_1"),
        rotation: {
          x: 50,
          y: -2.8734593602424665,
          z: 150.82574475465094,
        },
        time: 1000,
      },
      Shedeng1_2: {
        model: t.methods.getModel("Shedeng1_2"),
        rotation: {
          x: 60.42819143073471,
          y: -2.8734593602424665,
          z: 126.82574475465094,
        },
        time: 1000,
      },
      Shedeng1_3: {
        model: t.methods.getModel("Shedeng1_3"),
        rotation: {
          x: -1.7718410164401246,
          y: 1.287409187499856,
          z: -2.02599349243394,
        },
        time: 20,
      },
      Shedeng1_4: {
        model: t.methods.getModel("Shedeng1_4"),
        rotation: {
          x: -1.7701299049516555,
          y: -0.8572125165982781,
          z: -0.10905107736147579,
        },
        time: 20,
      },
    };
    this.radialMove();
  }

  // 射线移动
  radialMove() {
    Object.values(this.sheDengMap).map((sd) => {
      const { rotation, time } = sd;
      Utils.anima(
        {
          x: sd.model.rotation.x,
          y: sd.model.rotation.y,
          z: sd.model.rotation.z,
        },
        {
          repeat: -1,
          yoyo: true,
          x: rotation.x,
          y: rotation.y,
          z: rotation.z,
        },
        time,
        (data) => {
          sd.model.rotation.x = data.x;
          sd.model.rotation.y = data.y;
          sd.model.rotation.z = data.z;
        }
      );
    });
  }

  isShow() {
    Object.values(this.sheDengMap).map((i) => {
      i.model.visible = !i.model.visible;
    });
  }
}

// 孔明灯
class KongMingLight {
  // fbx加载器
  fbxLoader = t.runScene.fileEx;
  // 孔明灯表
  kongMingDengMap = {};
  isOnce = true;
  // 灯笼上升动画
  lightAnimaEvents = {};
  // 新孔明灯表
  Kong_Ming_Deng = {};

  kongMingDeng = null;

  async init() {
    this.kongMingDeng = t.methods.getModel("孔明灯");
    const count = 25;
    new Array(5).fill("").map((_, num) => {
      const { geometry, material } = this.kongMingDeng;
      geometry.computeVertexNormals();
      this.Kong_Ming_Deng[`kmd${num}`] = new THREE.InstancedMesh(
        geometry.clone(),
        material,
        count
      );
      this.Kong_Ming_Deng[`kmd${num}`].instanceMatrix.setUsage(
        THREE.DynamicDrawUsage
      );
      const dummy = new THREE.Object3D();

      for (let i = 0; i < count; i++) {
        let y = Math.random() * 200;
        let x = Math.random() * 1000;
        let z = -Math.random() * 1000;
        dummy.position.set(x, y, z);
        dummy.rotation.set(-Math.PI / 2, 0, 0);
        // dummy.scale.set(30, 30, 30);
        dummy.scale.set(2, 2, 2);
        this.Kong_Ming_Deng[`kmd${num}`].setMatrixAt(i, dummy.matrix);
        this.kongMingDengMap[`孔明灯克隆_${num}${i}`] = {
          id: i,
          model: this.Kong_Ming_Deng[`kmd${num}`],
          oldPositionY: y,
        };
        dummy.updateMatrix();
        this.Kong_Ming_Deng[`kmd${num}`].instanceMatrix.needsUpdate = true;
        this.Kong_Ming_Deng[`kmd${num}`].visible = false;
      }
      this.Kong_Ming_Deng[`kmd${num}`].name = `孔明灯组${num + 1}`;
      t.runScene.modelEx.add(this.Kong_Ming_Deng[`kmd${num}`]);
    });
  }

  anima(cb) {
    return new Promise((s) => {
      Object.values(this.Kong_Ming_Deng).map((light, index) => {
        const name = light.name;
        if (this.lightAnimaEvents[name])
          this.lightAnimaEvents ? this.lightAnimaEvents[name].kill() : null;
        const info = {
          light,
          name,
          s,
          cb,
          index,
        };
        this._gsap(info);
      });
    }).then(() => {
      cb();
    });
  }

  _gsap(info) {
    const { light, name, s } = info;
    light.layers.enable(1);
    light.visible = true;
    light.position.y = 0;
    const addY = Math.random() * 500;
    const time = (Math.random() + 0.6) * 25;
    // const time = (Math.random() + 0.6) * 2;
    this.lightAnimaEvents[name] = Utils.anima(
      {
        lightY: light.position.y,
        opc: 1,
      },
      {
        lightY: addY,
        opc: 0,
      },
      time,
      (data) => {
        light.position.y = data.lightY;
        light.material.opacity = data.opc;
      },
      () => {
        light.visible = false;
        Object.values(this.Kong_Ming_Deng).every((l) => l.visible === false)
          ? s()
          : null;
      }
    );
  }
}

// 莲花背景
class LotusBgc {
  lotuModel = null;
  init() {
    this.lotuModel = t.methods.getModel("荷花背景");
  }
  async isShow(isShow, cb, time) {
    console.log(this.lotuModel, "this.lotuModel");
    t.events.showAnima({
      model: this.lotuModel,
      isShow,
      time,
      cb,
    });
  }
}

// 生长树
class Tree {
  once = true;
  treeAnima = {};
  isShow = null;
  anima(isShow) {
    this.once = true;
    this.isShow = isShow;
    this.treeAnima[`one`] && this.treeAnima[`one`].kill();
    this.treeAnima[`one`] = Utils.anima(
      {
        pg: t.mtnhw.treeMaterial.uniforms.progress.value,
        time: 0,
      },
      {
        pg: isShow ? 0 : 1,
        time: 1,
      },
      6,
      (data) => {
        t.mtnhw.treeMaterial.uniforms.progress.value = data.pg;
        const Judge = t.tree.isShow ? data.time >= 0.5 : data.time <= 0.3;
        if (Judge && this.once) {
          this.once = false;
          if (this.once) return;
          this.treeAnima[`two`] && this.treeAnima[`two`].kill();
          t.tree.treeAnima[`two`] = Utils.anima(
            {
              opc: t.mtnhw.lightBallMesh.material.opacity,
            },
            {
              opc: t.tree.isShow ? 1 : 0,
            },
            2,
            (data) => {
              t.mtnhw.lightBallMesh.material.opacity = data.opc;
            }
          );
        }
      },
      () => { }
    );
  }
}

// 气泡
class Bubble {
  bubble = null;
  init() {
    this.bubble = t.methods.getModel("水泡");
    this.bubble.visible = true;
    this.bubble.scale.set(0, 0, 0);
  }
  events(isShow, cb, flag) {
    console.log(this.bubble.material, "this.bubble.material");
    this.bubble.material.matrixWorldNeedsUpdate = true;
    this.bubble.material.isSurge.value = true;
    if (flag != 1) {
      this.bubble.visible = isShow;
      this.bubble.scale.set(0, 0, 0);
    }
    Utils.anima(
      {
        scale: this.bubble.scale.x,
      },
      {
        scale: isShow ? 1 : 0,
      },
      3,
      (data) => {
        this.bubble.scale.set(data.scale, data.scale, data.scale);
      },
      () => {
        cb();
      }
    );
  }
}

// 广场亮灯
class SquareLight {
  nianHuangTang = null;
  guangCangDeng = null;
  init() {
    this.nianHuaiTang = t.runScene.modelEx.getModel("拈花堂亮灯group");
    this.guangCangDeng = t.runScene.modelEx.getModel("广场亮灯group");
    this.shangPuDeng = t.runScene.modelEx.getModel("商铺亮灯group");
    this.niangHuaiTangEvents(false);
    this.guangCangDengEvents(false);
    this.shangPuDengEvents(false);
  }

  // 拈花堂
  niangHuaiTangEvents(isShow) {
    this.nianHuaiTang.visible = isShow;
  }
  // 广场亮灯
  guangCangDengEvents(isShow) {
    this.guangCangDeng.children.map((mode) => {
      if (mode.name === "Shedeng2") {
        mode.visible = isShow;
      } else {
        t.runScene.modelEx.setGlow(mode, isShow);
      }
    });
  }
  // 商铺亮灯
  shangPuDengEvents(isShow) {
    this.shangPuDeng.traverse((mode) => {
      mode.layers && (mode.layers.mask = isShow ? 3 : 1);
      if (mode.layers) {
        t.runScene.modelEx.setGlow(mode, isShow);
      }
    });
  }
}

// 基本事件
class Events {
  constructor() {
    controls.addEventListener("start", this.controlStart);
    t.runScene.cb.events.pointer.down.add(
      "pointerDown",
      this.mouseDown
    );
    t.runScene.cb.events.pointer.up.add("pointerUp", this.mouseUp);
    t.runScene.cb.events.mouse.move.add("mouseMove", () => { });
  }

  showAnima(info) {
    const { model, isShow, time, cb, opacity } = info;
    const models = [];
    model.traverse((m) => {
      if (m.type === "Group") return;
      if (m.type === "Object3D") return;
      m.material.transparent = true;
      isShow ? (m.material.opacity = 0) : null;
      models.push(m);
    });
    if (isShow) model.visible = isShow;
    Utils.anima(
      { opc: isShow ? 0 : opacity || 1 },
      { opc: isShow ? opacity || 1 : 0 },
      time,
      (data) => {
        models.map((m) => (m.material.opacity = data.opc));
      },
      () => {
        if (!isShow) model.visible = isShow;
        cb && cb();
      }
    );
  }

  downPosition = { x: 0, y: 0 };

  closeAnimaAtStart = {};

  mouseDown = (event) => {
    this.downPosition = {
      x: event.offsetX,
      y: event.offsetY,
    };
  };

  mouseUp = (event) => {
    if (event.button === 2) return;
    const ux = event.offsetX;
    const uy = event.offsetY;
    const { x, y } = this.downPosition;
    // 当点击的位置和点击后的位置一致时就会触发
    ux === x && uy === y && this.triggerClick(event);
  };

  triggerClick = (e) => {
    console.log(controls, "controls");
    console.log(camera, "camera");
    // console.log(`cx:${controls.target.x}`);
    const model = t.runScene.modelEx.select;
    if (!model) return;
  };

  controlStart = () => { };

  closeAnmia() {
    Object.values(this.closeAnimaAtStart).map(
      (item) =>
        // 暂停动画 并清空内容 item就是那个动画
        item && item.kill()
    );
  }

  dispose() {
    dom.removeEventListener("pointerdown", this.mouseDown);
    dom.removeEventListener("pointerup", this.mouseUp);
    controls.removeEventListener("start", this.controlStart);
  }
}

export default Change;

// runScene.anima.play('Test 001')
// runScene.anima.pause('Test 001')
// runScene.anima.closeAnima()
// runScene.anima.playAll()
// runScene.anima.pauseAll()

//581.4321928755762 0 -702.6268867583516

// runScene.modelEx.clone('model')
// t.runScene.modelEx.clone()
