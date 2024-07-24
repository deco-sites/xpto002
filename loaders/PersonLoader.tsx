import { ResultSet, createClient }  from "https://esm.sh/@libsql/client@0.7.0";
import { load }                     from "https://deno.land/std@0.224.0/dotenv/mod.ts";
import  action                      from "site/actions/PersonTransform.tsx"
import { allowCorsFor, FnContext } from "deco/mod.ts";
import { rsort } from "std/semver/mod.ts";

const env = await load();

export type retorno = ResultSet;

export interface Props {
 /**
   * @format integer between 1 and 100.000
   * @description id of the profile.
   * @default 1
   */
 id: string;
}

export interface parametro {
  rs:retorno
}

export const turso = createClient({
  url: env["TURSO_DATABASE_URL"],
  authToken: env["TURSO_AUTH_TOKEN"],
});

export default async function loader(props: Props,
                                       req: Request,
                                       ctx: FnContext): Promise<retorno | undefined>
{
  let erro:ResultSet;
  try {
    // Allow Cors
    Object.entries(allowCorsFor(req)).map(([name, value]) => {
      ctx.response.headers.set(name, value);
    });

    ctx.response.headers.set("Access-Control-Allow-Origin","https://casoftapp-arthurcazevedo.turso.io");

    const retorno = await turso.execute({sql: "SELECT * FROM person where id=?", args: [props.id]});
    erro = retorno;
    return (
      action(retorno)
    );      
  } catch (error) {
    console.error(`\nErro ao acessar o banco de dados: ${env["TURSO_DATABASE_URL"]}\n${error}\n${erro}`)
  }
}
