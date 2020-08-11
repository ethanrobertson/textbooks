// =============================================================================
// Voxel Painter Component
// (c) Mathigon
// =============================================================================

/// <reference types="three"/>

import { $, $N, canvasPointerPosition, CanvasView, CustomElementView, ElementView, loadScript, register} from '@mathigon/boost';

import { RED,BLUE,GREEN,YELLOW,ORANGE,PURPLE } from '../../shared/constants';

import {clamp} from '@mathigon/fermat';

@register('x-voxel-painter')
export class VoxelPainter extends CustomElementView {

  async ready() {

    /**
     * TODO
      convert to using built in mathigon mouse stuff
      Only update when necessary
     */

    await loadScript('/resources/shared/vendor/three-91.min.js');

    const TAU = Math.PI * 2;

    const clock = new THREE.Clock(true);
    let frameDelta = 1. / 60.;

    const v1 = new THREE.Vector3();
    const v2 = new THREE.Vector3();

    const scene = new THREE.Scene();

    let rotateOnly = this.attr('rotateOnly');
    if (rotateOnly === undefined) {
      rotateOnly = false;
    }

    const renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.localClippingEnabled = true;
    renderer.setClearColor(0xffffff);
    scene.background = new THREE.Color(0xf0f0f0);
    renderer.setSize(400, 400);

    const objectsOnWhichVoxelsCanBePlaced: THREE.Object3D[] = [];

    const $canvas = $(renderer.domElement) as CanvasView;
    this.append($canvas);

    if (this.attr('showSaveButton') === 'true') {
      const $button = $N('button', { class: 'btn', text: 'Save' }, this);
      this.append($button);

      $button.on('click', () => {
        let outputString = '"';
        for (let i = 0; i < voxels.length; i++) {
          for (let j = 0; j < 3; j++) {
            outputString += voxels[i].position.getComponent(j) + ',';
          }
        }
        outputString += '"';
        prompt('In order to load the current voxels in, copy the below, then paste it next to shape= ', outputString);
      });
    }

    const rendererSize = renderer.getSize();
    let camera = null
    const cameraW = 30.;
    const cameraNear = 1.
    const cameraFar = 10000.
    if (this.attr('cameraStyle') === 'orthographic' )
    {
      const cameraH = cameraW * rendererSize.height /rendererSize.width;
      camera = new THREE.OrthographicCamera(-cameraW / 2., cameraW / 2., cameraH / 2., -cameraH / 2., cameraNear, cameraFar);
    }
    else
      camera = new THREE.PerspectiveCamera(45, rendererSize.width / rendererSize.height, cameraNear, cameraFar);
    camera.rotation.order = 'YXZ';
    camera.rotation.y = TAU/8.;
    camera.rotation.x =-TAU / 8.;
    camera.position.x = 40.;
    scene.add(camera);

    {
      const ambientLight = new THREE.AmbientLight(0x606060);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff);
      directionalLight.position.set(1, 0.75, 0.5).normalize();
      camera.updateMatrixWorld()
      camera.worldToLocal(directionalLight.position)
      camera.add(directionalLight);
    }

    const voxelGeo = new THREE.BoxGeometry(1, 1, 1);
    const voxelMaterial = new THREE.MeshLambertMaterial({color: 0xfeb74c});
    if ( this.attr('colorSides') === 'true') {
      voxelGeo.faces[0].color = new THREE.Color().setHex(parseInt("0x"+RED.substr(1,6) ))
      voxelGeo.faces[2].color = new THREE.Color().setHex(parseInt("0x"+BLUE.substr(1,6) ))
      voxelGeo.faces[4].color = new THREE.Color().setHex(parseInt("0x"+GREEN.substr(1,6) ))
      voxelGeo.faces[6].color = new THREE.Color().setHex(parseInt("0x"+YELLOW.substr(1,6) ))
      voxelGeo.faces[8].color = new THREE.Color().setHex(parseInt("0x"+ORANGE.substr(1,6) ))
      voxelGeo.faces[10].color = new THREE.Color().setHex(parseInt("0x"+PURPLE.substr(1,6) ))
      for (let i = 0; i < 6; ++i) {
        voxelGeo.faces[i * 2 + 1].color = voxelGeo.faces[i * 2 + 0].color;
      }

      voxelMaterial.vertexColors = THREE.FaceColors;
      voxelMaterial.color.setRGB(1., 1., 1.);
    }

    const outlineGeometry = new THREE.Geometry();
    const outlineMaterial = new THREE.LineBasicMaterial();
    const cubeEdges = [0, 1, 2, 3, 5, 4, 7, 6, 0, 2, 1, 3, 5, 7, 4, 6, 0, 5, 1, 4, 2, 7, 3, 6];
    for (let i = 0; i < cubeEdges.length; i++) {
      outlineGeometry.vertices[i] = voxelGeo.vertices[cubeEdges[i]].clone();
    }

    const placementVisualizer = new THREE.Mesh(voxelGeo, new THREE.MeshBasicMaterial(
        {color: 0xff0000, opacity: 0.4, transparent: true}));
    scene.add(placementVisualizer);
    placementVisualizer.add(new THREE.LineSegments(outlineGeometry, outlineMaterial));

    const voxels = [];
    class Voxel extends THREE.Mesh {
      constructor() {
        super(voxelGeo, voxelMaterial);
        this.add(new THREE.LineSegments(outlineGeometry, outlineMaterial));
        voxels.push(this);
        objectsOnWhichVoxelsCanBePlaced.push(this);
        scene.add(this);
      }
    }

    const eraser = new THREE.Mesh(new THREE.PlaneBufferGeometry(1., 1.), new THREE.MeshBasicMaterial({transparent: true}));
    {
      eraser.scale.setScalar(.2)
      camera.add(eraser);

      // eraser picture is from https://www.kissclipart.com/ which is public domain
      const loader = new THREE.TextureLoader();
      loader.load('/resources/solids/eraser.png',
          function(texture) {
            eraser.material.map = texture;
            eraser.material.needsUpdate = true;
          },
          undefined,
          function(err) {
            console.error(err);
          }
      );

      eraser.defaultPosition = new THREE.Vector3();
      eraser.defaultPosition.z = -cameraNear * 2.;
      eraser.defaultPosition.x = -.7;
      eraser.defaultPosition.y = -.7;

      if (this.attr('cameraStyle') === 'orthographic')
      {
        eraser.defaultPosition.x = -cameraW * .4
        eraser.defaultPosition.y = eraser.defaultPosition.x * rendererSize.height / rendererSize.width

        eraser.scale.setScalar(5.)
      }

      eraser.position.copy(eraser.defaultPosition);
    }

    {
      const isInShapeFunctions = {};

      const sphereRadius = 5;
      const sphereCenter = new THREE.Vector3(0, sphereRadius, 0);
      isInShapeFunctions.sphere = (p) => p.distanceTo(sphereCenter) < sphereRadius;

      const cuboidDimensions = new THREE.Vector3(4, 3, 5);
      const cuboidCenter = new THREE.Vector3(0., cuboidDimensions.y / 2. + 1., 0.);
      isInShapeFunctions.cuboid = (p) => {
        return Math.abs(p.x - cuboidCenter.x) < cuboidDimensions.x / 2. &&
          Math.abs(p.y - cuboidCenter.y) < cuboidDimensions.y / 2. &&
          Math.abs(p.z - cuboidCenter.z) < cuboidDimensions.z / 2.;
      };

      const cylinderRadius = 6;
      const cylinderHeight = 4;
      const cylinderCenter = new THREE.Vector3(0., cylinderHeight/2. + 1., 0.);
      isInShapeFunctions.cylinder = (p) => {
        v1.copy(p);
        v1.sub(cylinderCenter);
        return v1.x * v1.x + v1.z * v1.z < cylinderRadius*cylinderRadius && Math.abs(v1.y) < cylinderHeight / 2.;
      };

      const shape = this.attr('shape');

      if (isInShapeFunctions[shape] !== undefined) {
        const isInShapeFunction = isInShapeFunctions[shape];
        const p = new THREE.Vector3();
        for (let i = -10; i < 10; i++) {
          for (let j = -10; j < 10; j++) {
            for (let k = -10; k < 10; k++) {
              p.set(i, j, k).addScalar(.5);
              if (isInShapeFunction(p)) {
                const voxel = new Voxel();
                voxel.position.copy(p);
              }
            }
          }
        }
      }

      const coords = shape.split(',');
      for (let i = 0, il = Math.floor(coords.length / 3); i < il; ++i) {
        const voxel = new Voxel();
        voxel.position.set(
            parseFloat(coords[i * 3 + 0]),
            parseFloat(coords[i * 3 + 1]),
            parseFloat(coords[i * 3 + 2]));
        snapToNearestValidCubeCenterPosition(voxel.position);
      }
    }

    const pointerRaycaster = new THREE.Raycaster();

    let mouseControlMode: 'rotating' | 'placing' | 'erasing' | '' = ''

    const placingStart = new THREE.Vector3();
    const placingEnd = new THREE.Vector3();
    const gridDimension = 20;
    const floorIntersectionPlaneGeometry = new THREE.PlaneBufferGeometry(gridDimension, gridDimension);
    const floorIntersectionPlane = new THREE.Mesh(floorIntersectionPlaneGeometry, new THREE.MeshBasicMaterial({visible: false}));
    const placingHelpers = [];
    {
      floorIntersectionPlane.add(new THREE.GridHelper(gridDimension, gridDimension));
      floorIntersectionPlaneGeometry.rotateX(-Math.PI / 2);
      scene.add(floorIntersectionPlane);
      objectsOnWhichVoxelsCanBePlaced.push(floorIntersectionPlane);
      floorIntersectionPlane.position.y -= 2.

      for (let i = 0; i < 3; i++) {
        const placingHelper = new THREE.Mesh(new THREE.PlaneBufferGeometry(999., 999.), new THREE.MeshBasicMaterial({side: THREE.DoubleSide,
          // transparent:true,
          // opacity:.5,
          visible: false
        }));
        placingHelpers.push(placingHelper);
        scene.add(placingHelper);
      }
      placingHelpers[0].geometry.rotateX( TAU / 4.);
      placingHelpers[1].geometry.rotateY( TAU / 4.);
      placingHelpers[2].geometry.rotateZ( TAU / 4.);
      // placingHelpers[0].material.color.setRGB(1.,0.,0.)
      // placingHelpers[1].material.color.setRGB(1.,1.,0.)
      // placingHelpers[2].material.color.setRGB(1.,0.,1.)
    }

    function snapToNearestValidCubeCenterPosition(p) {
      p.floor().addScalar(.5);
    }

    function setPositionFromVoxelIntersection(p, intersection) {
      p.copy(intersection!.face!.normal).multiplyScalar(.1);
      p.add(intersection.point);
      snapToNearestValidCubeCenterPosition(p);
    }

    function getCameraDirectionSnappedToGrid(target) {
      target.set(0., 0., -1.).applyQuaternion(camera.quaternion)
      target.x = target.x > 0. ? .5 : -.5
      target.y = target.y > 0. ? .5 : -.5
      target.z = target.z > 0. ? .5 : -.5
    }

    const asyncPointerNdc = new THREE.Vector3()
    const pointerNdc = new THREE.Vector3()
    const oldPointerNdc = new THREE.Vector3()
    $canvas.on('pointermove', (event: PointerEvent) => {
      event.preventDefault();

      const p = canvasPointerPosition(event, $canvas);
      camera.updateMatrixWorld();
      asyncPointerNdc.set((p.x / $canvas.width ) * 2. - 1.,
          -(p.y / $canvas.height) * 2. + 1.);
    });

    // slide($canvas, {
    //   down: () => { },
    //   move: () => { },
    //   end: () => { }
    // })

    $canvas.on('pointerdown', (event: PointerEvent) => {
      event.preventDefault();

      const eraserIntersected = pointerRaycaster.intersectObject(eraser)[0] !== undefined;
      if (eraserIntersected) {
        mouseControlMode = 'erasing';
      } else {
        const intersection = pointerRaycaster.intersectObjects(objectsOnWhichVoxelsCanBePlaced)[0];
        if (intersection !== undefined && !rotateOnly) {
          mouseControlMode = 'placing';
          setPositionFromVoxelIntersection(placingStart, intersection);
          placingEnd.copy(placingStart);

          // corner of cube that is away from camera
          getCameraDirectionSnappedToGrid(v1)
          v1.add(placingStart);
          for (let i = 0; i < 3; i++) {
            placingHelpers[i].position.copy(v1);
            placingHelpers[i].updateMatrixWorld();
          }
        } else mouseControlMode = 'rotating';
      }
    });

    $canvas.on('pointerup', (event: PointerEvent) => {
      event.preventDefault();

      if (mouseControlMode === 'placing') {
        let iComponent = 0;
        if (placingStart.x === placingEnd.x) iComponent = 1;
        if (placingStart.y === placingEnd.y) iComponent = 2;
        if (placingStart.z === placingEnd.z) iComponent = 0;
        const jComponent = (iComponent + 1) % 3;
        const kComponent = (jComponent + 1) % 3;
        const k = placingStart.getComponent(kComponent);

        const iStart = Math.min( placingStart.getComponent(iComponent), placingEnd.getComponent(iComponent) );
        const iLimit = Math.max( placingStart.getComponent(iComponent), placingEnd.getComponent(iComponent) );
        const jStart = Math.min( placingStart.getComponent(jComponent), placingEnd.getComponent(jComponent) );
        const jLimit = Math.max( placingStart.getComponent(jComponent), placingEnd.getComponent(jComponent) );

        const potentialNewPosition = new THREE.Vector3();
        for ( let i = iStart; i <= iLimit; i+= 1.) {
          for ( let j = jStart; j <= jLimit; j += 1.) {
            potentialNewPosition.setComponent(kComponent, k);
            potentialNewPosition.setComponent(iComponent, i);
            potentialNewPosition.setComponent(jComponent, j);
            snapToNearestValidCubeCenterPosition(potentialNewPosition);
            let alreadyOccupied = false;
            voxels.forEach((voxel)=>{
              if (voxel.position.equals(potentialNewPosition)) alreadyOccupied = true;
            });
            if (!alreadyOccupied)
              new Voxel().position.copy(potentialNewPosition);
          }
        }
      }

      mouseControlMode = '';
      placementVisualizer.scale.setScalar(1.);
    });

    function getStepTowardDestination(currentValue, destination) {
      const distanceFromDestination = destination - currentValue;
      const sign = distanceFromDestination == 0. ? 0. : distanceFromDestination / Math.abs(distanceFromDestination);
      let speed = .01;
      if (speed > Math.abs(distanceFromDestination)) {
        speed = Math.abs(distanceFromDestination);
      }
      return sign * speed;
    }

    function loop() {
      const clockDelta = clock.getDelta();
      frameDelta = clockDelta < .1 ? clockDelta : .1; // clamped because debugger pauses create weirdness

      oldPointerNdc.copy(pointerNdc)
      pointerNdc.copy(asyncPointerNdc)
      pointerRaycaster.setFromCamera(pointerNdc, camera)

      // camera
      {
        if (mouseControlMode === 'rotating') { 
          camera.rotation.y -= (pointerNdc.x - oldPointerNdc.x)
          camera.rotation.x += (pointerNdc.y - oldPointerNdc.y)
          camera.rotation.x = clamp(camera.rotation.x, -TAU / 4., TAU / 4.);
        } else {
          // snapspace is where the angles we want are integers
          const snapSpaceAngleX = camera.rotation.x / (TAU / 14.);
          let destination = Math.round(snapSpaceAngleX)
          // destination = clamp(destination, -1, 1)
          const newSnapSpaceAngleX = snapSpaceAngleX + getStepTowardDestination(snapSpaceAngleX, destination );
          camera.rotation.x = newSnapSpaceAngleX * (TAU / 14.);

          const snapSpaceAngleY = camera.rotation.y / (TAU / 8.);
          const newSnapSpaceAngleY = snapSpaceAngleY + getStepTowardDestination(snapSpaceAngleY, Math.round(snapSpaceAngleY));
          camera.rotation.y = newSnapSpaceAngleY * (TAU / 8.);
        }

        const currentDistFromCamera = camera.position.length();
        camera.updateMatrixWorld();
        v1.set(0., 0., -currentDistFromCamera);
        camera.localToWorld(v1);
        camera.position.sub(v1);
      }

      if (mouseControlMode === 'placing') {
        const intersection = pointerRaycaster.intersectObjects(placingHelpers)[0];
        if (intersection !== undefined) {
          //get it off the helpers
          getCameraDirectionSnappedToGrid(placingEnd)
          placingEnd.negate().setLength(.1)
          placingEnd.add(intersection.point);
          snapToNearestValidCubeCenterPosition(placingEnd);

          placementVisualizer.position.addVectors(placingEnd, placingStart).multiplyScalar(.5);
          placementVisualizer.scale.x = 1. + 2. * Math.abs(placementVisualizer.position.x - placingEnd.x);
          placementVisualizer.scale.y = 1. + 2. * Math.abs(placementVisualizer.position.y - placingEnd.y);
          placementVisualizer.scale.z = 1. + 2. * Math.abs(placementVisualizer.position.z - placingEnd.z);
        }
      } else {
        if (mouseControlMode === 'rotating' || mouseControlMode === 'erasing' || rotateOnly) {
          placementVisualizer.scale.setScalar(.0000001);
        } else {
          const intersections = pointerRaycaster.intersectObjects(objectsOnWhichVoxelsCanBePlaced);
          if (intersections.length > 0) {
            setPositionFromVoxelIntersection(placementVisualizer.position, intersections[0]);
            placementVisualizer.scale.setScalar(1.);
          } else {
            placementVisualizer.scale.setScalar(.0000001);
          }
        }
      }

      if (mouseControlMode === 'erasing') {
        pointerRaycaster.ray.at(eraser.position.length(), eraser.position);
        camera.updateMatrixWorld();
        camera.worldToLocal(eraser.position);

        const intersections = pointerRaycaster.intersectObjects(objectsOnWhichVoxelsCanBePlaced);
        if (intersections.length > 0) {
          for (let i = 0, il = intersections.length; i < il; ++i) {
            if (intersections[i].object !== floorIntersectionPlane) {
              const voxel = intersections[i].object;
              scene.remove(voxel);
              objectsOnWhichVoxelsCanBePlaced.splice(objectsOnWhichVoxelsCanBePlaced.indexOf(voxel), 1);
              voxels.splice(voxels.indexOf(voxel), 1);
            }
          }
        }
      }
      else
        eraser.position.lerp(eraser.defaultPosition, .1);

      requestAnimationFrame(loop);
      renderer.render(scene, camera);
    }
    loop();
  }
}