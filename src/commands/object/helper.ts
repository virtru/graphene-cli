import {KeyGenMechanism, ObjectClass, PrivateKey, PublicKey, SecretKey, Storage } from "graphene-pk11";
import * as NodeRSA from "node-rsa";
import { exportPrivateKey, exportPublicKey, Handle, rpad} from "../../helper";
import * as Stream from "stream";
import {Writable} from "stream";
export function print_object_header() {
    console.log("| %s | %s | %s |", rpad("ID", 4), rpad("Class", 15), rpad("Label", 30));
    console.log("|%s|%s|%s|", rpad("", 6, "-"), rpad("", 17, "-"), rpad("", 32, "-"));
}

export function print_object_row(obj: Storage) {
    console.log(
        "| %s | %s | %s |",
        rpad(Handle.toString(obj.handle), 4),
        rpad(ObjectClass[obj.class], 15),
        rpad(obj.label, 30));
}

export function print_object_info(obj: Storage) {
    const TEMPLATE = "| %s | %s |";
    const COL_1 = 20;
    const COL_2 = 25;
    console.log(TEMPLATE, rpad("Name", COL_1), rpad("Value", COL_2));
    console.log(TEMPLATE.replace(/\s/g, "-"), rpad("", COL_1, "-"), rpad("", COL_2, "-"));
    console.log(TEMPLATE, rpad("Handle", COL_1), rpad(Handle.toString(obj.handle), COL_2));
    console.log(TEMPLATE, rpad("Class", COL_1), rpad(ObjectClass[obj.class], COL_2));
    console.log(TEMPLATE, rpad("Label", COL_1), rpad(obj.label, COL_2));
    console.log(TEMPLATE, rpad("Token", COL_1), rpad(obj.token, COL_2));
    console.log(TEMPLATE, rpad("Private", COL_1), rpad(obj.private, COL_2));
    console.log(TEMPLATE, rpad("Modifiable", COL_1), rpad(obj.modifiable, COL_2));

    if (obj.class === ObjectClass.PRIVATE_KEY) {
        const o: PrivateKey = obj.toType<PrivateKey>();
        console.log(TEMPLATE, rpad("ID", COL_1), rpad(o.id.toString("hex"), COL_2));
        console.log(TEMPLATE, rpad("Mechanism", COL_1), rpad(KeyGenMechanism[o.mechanism], COL_2));
        console.log(TEMPLATE, rpad("Local", COL_1), rpad(o.local, COL_2));
        console.log(TEMPLATE, rpad("Sensitive", COL_1), rpad(o.sensitive, COL_2));
        console.log(TEMPLATE, rpad("Extractable", COL_1), rpad(o.extractable, COL_2));
        console.log(TEMPLATE, rpad("Derive", COL_1), rpad(o.derive, COL_2));
        console.log(TEMPLATE, rpad("Decrypt", COL_1), rpad(o.decrypt, COL_2));
        console.log(TEMPLATE, rpad("Sign", COL_1), rpad(o.sign, COL_2));
        console.log(TEMPLATE, rpad("Sign recover", COL_1), rpad(o.signRecover, COL_2));
        console.log(TEMPLATE, rpad("Unwrap", COL_1), rpad(o.unwrap, COL_2));
    } else if (obj.class === ObjectClass.PUBLIC_KEY) {
        const o: PublicKey = obj.toType<PublicKey>();
        console.log(TEMPLATE, rpad("ID", COL_1), rpad(o.id.toString("hex"), COL_2));
        console.log(TEMPLATE, rpad("Mechanism", COL_1), rpad(KeyGenMechanism[o.mechanism], COL_2));
        console.log(TEMPLATE, rpad("Local", COL_1), rpad(o.local, COL_2));
        console.log(TEMPLATE, rpad("Derive", COL_1), rpad(o.derive, COL_2));
        console.log(TEMPLATE, rpad("Encrypt", COL_1), rpad(o.encrypt, COL_2));
        console.log(TEMPLATE, rpad("Verify", COL_1), rpad(o.verify, COL_2));
        console.log(TEMPLATE, rpad("Wrap", COL_1), rpad(o.wrap, COL_2));
    } else if (obj.class === ObjectClass.SECRET_KEY) {
        const o: SecretKey = obj.toType<SecretKey>();
        console.log(TEMPLATE, rpad("ID", COL_1), rpad(o.id.toString("hex"), COL_2));
        console.log(TEMPLATE, rpad("Mechanism", COL_1), rpad(KeyGenMechanism[o.mechanism], COL_2));
        console.log(TEMPLATE, rpad("Local", COL_1), rpad(o.local, COL_2));
        console.log(TEMPLATE, rpad("Sensitive", COL_1), rpad(o.sensitive, COL_2));
        console.log(TEMPLATE, rpad("Extractable", COL_1), rpad(o.extractable, COL_2));
        console.log(TEMPLATE, rpad("Derive", COL_1), rpad(o.derive, COL_2));
        console.log(TEMPLATE, rpad("Encrypt", COL_1), rpad(o.encrypt, COL_2));
        console.log(TEMPLATE, rpad("Decrypt", COL_1), rpad(o.decrypt, COL_2));
        console.log(TEMPLATE, rpad("Sign", COL_1), rpad(o.sign, COL_2));
        console.log(TEMPLATE, rpad("Verify", COL_1), rpad(o.verify, COL_2));
        console.log(TEMPLATE, rpad("Unwrap", COL_1), rpad(o.unwrap, COL_2));
        console.log(TEMPLATE, rpad("Wrap", COL_1), rpad(o.wrap, COL_2));
    }
}

/**
 *
 * @param obj {Storage}
 * @param format {NodeRSA.FormatPem}
 * @param output {WriteStream}
 */
export async function writeSecureObj(obj: Storage,
                                     format: NodeRSA.FormatPem,
                                     output: Writable = process.stdout) {
    let key: string;
    if (obj.class === ObjectClass.PUBLIC_KEY) {
        key = exportPublicKey(obj).exportKey(format);
    } else if (obj.class === ObjectClass.PRIVATE_KEY) {
        key = exportPrivateKey(obj).exportKey(format);
    } else {
        throw new Error("Support only public or private key");
    }
    return new Promise((resolve, reject) => {
        output.write(key, (err: any) => {
            if (err) reject(err);
            resolve(undefined);
        });
    })

}
