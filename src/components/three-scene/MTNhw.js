import * as THREE from "three";
import {LokiMaterial} from "../materials/LokiMaterial";
import {PARAMS} from '../materials/ParticleMaterialParams';
import {ParticleSystem} from "./ParticleSystem";

export class MTNhw {
    constructor({camera, scene, renderer}, {tree, lightBall}) {
        this.mainScene = scene;
        this.mainCamera = camera;
        this.renderer = renderer;
        this.treeMesh = tree;
        this.lightBallMesh = lightBall;

        try {
            this.initMaterials();
            this.initScene();
            this.preload().then(() => {
            });
        } catch (e) {
            console.log('Error: ', e);
        }
    }

    async preload() {
        // Load async stuff
        // this.assets = {
        //     map: await this.loadTexture('textures/tree.png'),
        //     emissiveMap: await this.loadTexture('textures/treeEmissive.jpg'),
        // }
    }

    initMaterials() {
        const {
            progress,
            baseNoiseIteration,
            noiseDiffusion,
            mainColor,
            noisePrecision,
            lightningThickness,
            lightningPower,
            lightningDiffusion,
            vanishDirection,
        } = PARAMS;

        this.treeMaterial = new LokiMaterial({
            progress,
            baseNoiseIteration,
            noisePrecision,
            size: {value: new THREE.Vector3()},
            lightColor: {value: new THREE.Color(mainColor)},
            noiseDiffusion,
            lightningThickness,
            lightningPower,
            lightningDiffusion,
            vanishDirection,
            time: {value: 0},
        });
    }

    initScene() {
        const oldMat = this.treeMesh.material;
        const geometry = this.treeMesh.geometry.clone();
        geometry.computeBoundingBox();
        const treeSize = new THREE.Vector3();
        geometry.boundingBox.getSize(treeSize);
        this.treeMesh.material = this.treeMaterial;
        this.treeMaterial.uniforms.size.value.copy(treeSize);
        this.treeMaterial.uniforms.alphaTest = new THREE.Uniform(oldMat.alphaTest);
        this.treeMaterial.uniforms.color = new THREE.Uniform(oldMat.color.clone());
        this.treeMaterial.uniforms.emissive = new THREE.Uniform(oldMat.emissive.clone());

        // this.treeMaterial.uniforms.map = new THREE.Uniform(this.assets.map);
        this.treeMaterial.uniforms.map = new THREE.Uniform(oldMat.map.clone());
        // this.treeMaterial.uniforms.emissiveMap = new THREE.Uniform(this.assets.emissiveMap);
        this.treeMaterial.uniforms.emissiveMap = new THREE.Uniform(oldMat.emissiveMap.clone());

        let worldPosition = new THREE.Vector3();
        this.treeMesh.getWorldPosition(worldPosition);

        this.treeParticles = new ParticleSystem(this.treeMesh);
        this.treeParticles.position.set(worldPosition.x, worldPosition.y, worldPosition.z);
        this.treeParticles.scale.multiplyScalar(0.1);
        this.mainScene.add(this.treeParticles);
    }

    update() {
        if (this.treeMaterial) this.treeMaterial.onUpdate();
        if (this.treeParticles) this.treeParticles.material.onUpdate();
    }

    loadTexture(url) {
        return new Promise((resolve) => {
            new THREE.TextureLoader().load(url, (data) => {
                if (!THREE.MathUtils.isPowerOfTwo(data.image.width) || !THREE.MathUtils.isPowerOfTwo(data.image.height)) {
                    console.warn(`"${url}" image size is not power of 2.`);
                }
                data.needsUpdate = true;
                resolve(data);
            })
        })
    }
}
