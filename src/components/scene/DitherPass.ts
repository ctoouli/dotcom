import { ShaderPass } from "three-stdlib";
import { ditherShader } from "./shaders/ditherShader";

export class DitherPass extends ShaderPass {
  constructor() {
    super(ditherShader);
  }

  setSize(width: number, height: number): void {
    const res = this.uniforms.resolution?.value;
    if (res) res.set(width, height);
    super.setSize(width, height);
  }
}
