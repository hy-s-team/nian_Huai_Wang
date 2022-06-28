import * as THREE from "three";
import { Utils } from "run-scene-v2";
const { getRes, getMacro } = Utils;
import { MTNhw } from "./MTNhw";
import { FresnelShader } from "./../materials/FresnelShader";
import VConsole from "vconsole";
// 声明变量
let camera, scene, controls, renderer2, renderer, dom, t, p, runScene;

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

  this.vConsole = new VConsole();

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
  runScene.on("lazyLoadedTexture", () => {
  });

  runScene.on("complete", async () => {
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

    t.runScene.cb.render.add("bubble", () => {
      t.bubble.fresnelUniforms &&
        (t.bubble.fresnelUniforms.time.value += 6 * this.clock.getDelta());
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
  //人出现进入店铺后消失
  createPeopleToShop(number, shop) {
    for (let i = 0; i < number; i++) {
      let person = t.cloneEvent.copyModel(this.cloneModel);
      t.cloneEvent.setCopyModelProperty(person, {
        visible: true,
        position: {
          x: this.shopMap[shop].rangePosition.x,
          y: this.shopMap[shop].rangePosition.y,
          z: this.getRandomRangePosition(
            this.shopMap[shop].endZ,
            this.shopMap[shop].beginZ
          ),
        },
        opacity: 0,
      });
      console.log(scene.children, "1");
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
        () => {
          Utils.anima(
            {
              x: person.position.x,
              y: person.position.y,
              z: person.position.z,
            },
            {
              x: this.shopMap[shop].doorPosition.x,
              y: this.shopMap[shop].doorPosition.y,
              z: this.shopMap[shop].doorPosition.z,
            },
            1.5,
            (data) => {
              person.position.x = data.x;
              person.position.y = data.y;
              person.position.z = data.z;
              console.log(scene.children.length, "2");
            },
            () => {
              t.cloneEvent.clearCopyModel(person);
              console.log(scene.children.length, "3");
            }
          );
        }
      );
    }
  }
  //生成金币看板
  createGoldBorder() {
    Object.keys(this.shopMap).map((i) => {
      // console.log(this.shopMap[i].borderPosition);
      let dom = document.querySelector(`.${i}金币`);
      Utils.getMacro(() => {
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
    t.runScene.anima.setModelAnimaNames(flower, ["flower"]);
    t.runScene.modelEx.add(flower);
    this.flower = flower;
    this.flower.visible = false;
    this.flower.position.set(
      582.1630877495076,
      318.1238684195186,
      -742.0680735984594
    );
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
    // t.events.showAnima({
    //   model: this.flower,
    //   isShow,
    //   time: 4,
    // });
    // t.runScene.anima.play("Take 001");
    // await new Promise((s) => setTimeout(s, 6000));
    // const anima = t.runScene.anima.map["Take 001"];
    // t.runScene.anima.playings.delete(anima);
    // await new Promise((s) => setTimeout(s, 2000));
    // t.events.showAnima({
    //   model: this.flower,
    //   isShow: false,
    //   time: 2,
    //   cb: cb
    // });

    t.events.showAnima({
      model: this.flower,
      isShow,
      time: 4,
    });
    t.runScene.anima.play("flower", {
      // loop: false,
      // lastFrame: false,
      onFinished() {
        t.events.showAnima({
          model: t.flower.flower,
          isShow: false,
          time: 2,
          cb: cb,
        });
      },
    });
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
          // yoyoEase: true,
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

  async anima() {
    Object.values(this.Kong_Ming_Deng).map((light) => {
      if (this.lightAnimaEvents[light.name])
        this.lightAnimaEvents ? this.lightAnimaEvents[light.name].kill() : null;
      this._gsap(light, light.name);
    });
  }

  _gsap(light, name) {
    light.layers.enable(1);
    light.visible = true;
    light.position.y = 0;
    const addY = Math.random() * 500;
    const time = (Math.random() + 0.6) * 25;
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
        // light.material.opacity = data.opc;
      },
      () => {
        light.visible = false;
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
  anima() {
    this.reset();
    this.treeAnima[`one`] = Utils.anima(
      {
        pg: 1,
      },
      {
        pg: 0,
      },
      6,
      (data) => {
        t.mtnhw.treeMaterial.uniforms.progress.value = data.pg;
        if (data.pg <= 0.5 && this.once) {
          this.once = false;
          if (this.once) return;
          this.treeAnima[`two`] && this.treeAnima[`two`].kill();
          t.mtnhw.lightBallMesh.material.opacity = 0;
          t.tree.treeAnima[`two`] = Utils.anima(
            {
              opc: 0,
            },
            {
              opc: 1,
            },
            2,
            (data) => {
              t.mtnhw.lightBallMesh.material.opacity = data.opc;
            }
          );
        }
      },
      () => {
        this.once = true;
        t.mtnhw.lightBallMesh.material.opacity = 0;
        t.mtnhw.treeMaterial.uniforms.progress.value = 1;
      }
    );
  }

  reset() {
    this.once = true;
    t.mtnhw.treeMaterial.uniforms.progress.value = 1;
    t.mtnhw.lightBallMesh.material.opacity = 0;
    this.treeAnima[`two`] && this.treeAnima[`two`].kill();
    this.treeAnima[`one`] && this.treeAnima[`one`].kill();
  }
}

// 气泡
class Bubble {
  bubble = null;
  fresnelUniforms = undefined;
  init() {
    this.bubble = t.methods.getModel("水泡");
    this.bubble.visible = true;
    this.bubble.scale.set(0, 0, 0);
    this.fresnelUniforms = FresnelShader.uniforms;
    this.bubble.material.onBeforeCompile = (shader) => {
      if (!shader.uniforms.time)
        shader.uniforms.time = this.fresnelUniforms.time;
      if (!shader.uniforms.fresnelBias)
        shader.uniforms.fresnelBias = this.fresnelUniforms.bias;
      if (!shader.uniforms.fresnelScale)
        shader.uniforms.fresnelScale = this.fresnelUniforms.scale;
      if (!shader.uniforms.fresnelPower)
        shader.uniforms.fresnelPower = this.fresnelUniforms.power;
      shader.vertexShader = shader.vertexShader.replace(
        /varying vec3 vWorldPosition;/g,
        FresnelShader.vertexParas
      );
      shader.vertexShader = shader.vertexShader.replace(
        /#include <begin_vertex>/g,
        FresnelShader.vertexShader1
      );
      shader.vertexShader = shader.vertexShader.replace(
        /vWorldPosition = worldPosition.xyz;/g,
        FresnelShader.vertexShader2
      );
      shader.fragmentShader = shader.fragmentShader.replace(
        /#include <transmission_pars_fragment>/g,
        FresnelShader.fragmentParas
      );
      shader.fragmentShader = shader.fragmentShader.replace(
        /vec3 totalEmissiveRadiance = emissive;/g,
        FresnelShader.fragmentShaderEmissive
      );
    };
  }
  events() {
    Utils.anima(
      {
        scale: 0,
      },
      {
        scale: 1,
      },
      3,
      (data) => {
        this.bubble.scale.set(data.scale, data.scale, data.scale);
      },
      () => {
        let timer = setTimeout(() => {
          this.bubble.scale.set(0, 0, 0);
          clearTimeout(timer);
        }, 3000);
      }
    );
  }
}

// 广场亮灯
class SquareLight {
  nianHuangTang = null;
  guangCangDeng = null;
  init() {
    this.nianHuaiTang = t.runScene.modelEx.getModel('拈花堂亮灯group');
    this.guangCangDeng = t.runScene.modelEx.getModel('广场亮灯group');
    this.shangPuDeng = t.runScene.modelEx.getModel('商铺亮灯group');
  }

  niangHuaiTangEvents(isShow) {
    this.nianHuaiTang.visible = isShow;
  }

  guangCangDengEvents(isShow) {
    this.guangCangDeng.children.map((mode) => {
      if (mode.name === 'Shedeng2') {
        mode.visible = isShow
      } else {
        t.runScene.modelEx.setGlow(mode, isShow);
      }
    })
  }

  shangPuDengEvents(isShow) {
    this.shangPuDeng.traverse((mode) => {
      mode.layers && (mode.layers.mask = isShow ? 3 : 1)
      if (mode.layers) {
        t.runScene.modelEx.setGlow(mode, isShow);
      }
    })
  }


}

// 基本事件
class Events {
  constructor() {
    controls.addEventListener("start", this.controlStart);
    t.runScene.optionsEx.cb.events.pointer.down.add(
      "pointerDown",
      this.mouseDown
    );
    t.runScene.optionsEx.cb.events.pointer.up.add("pointerUp", this.mouseUp);
    t.runScene.optionsEx.cb.events.mouse.move.add("mouseMove", () => { });
  }

  showAnima(info) {
    const { model, isShow, time, cb } = info;
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
      { opc: isShow ? 0 : 1 },
      { opc: isShow ? 1 : 0 },
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
