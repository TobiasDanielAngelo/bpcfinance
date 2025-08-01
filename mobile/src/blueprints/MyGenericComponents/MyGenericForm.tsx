import moment from "moment";
import { useState } from "react";
import { View } from "react-native";
import { toTitleCase } from "../../constants/helpers";
import { Field } from "../../constants/interfaces";
import { MyForm } from "../MyForm";

export interface MyGenericFormProps<T> {
  item?: T & { id?: number | string };
  setVisible?: (t: boolean) => void;
  fetchFcn?: () => void;
  fields: Field[][];
  objectName: string;
  store: {
    addItem: (details: T) => Promise<any>;
    updateItem: (id: number | string, item: T) => Promise<any>;
    deleteItem: (id: number | string) => Promise<any>;
  };
  dateFields?: (keyof T)[];
  datetimeFields?: (keyof T)[];
  timeFields?: (keyof T)[];
}

export function MyGenericForm<T>({
  item,
  setVisible,
  fetchFcn,
  fields,
  objectName,
  store,
  dateFields = [],
  datetimeFields = [],
  timeFields = [],
}: MyGenericFormProps<T>) {
  const title = item?.id
    ? `Edit ${toTitleCase(objectName)}`
    : `${toTitleCase(objectName)} Creation Form`;

  const transformFrom = (raw: T): T => {
    const copy = { ...raw };
    dateFields.forEach((k) => {
      if (copy[k])
        copy[k] = moment(copy[k] as any).format("MMM D, YYYY") as any;
    });
    datetimeFields.forEach((k) => {
      if (copy[k])
        copy[k] = moment(copy[k] as any).format("MMM D YYYY h:mm A") as any;
    });
    timeFields.forEach((k) => {
      if (copy[k])
        copy[k] = moment(copy[k] as any, "HH:mm:ss").format("h:mm A") as any;
    });

    return copy;
  };

  const transformTo = (raw: T): T => {
    const copy = { ...raw };

    dateFields.forEach((k) => {
      const val = copy[k];
      if (val === "") {
        copy[k] = null as any;
      } else if (val) {
        copy[k] = moment(val as any, "MMM D, YYYY").format("YYYY-MM-DD") as any;
      }
    });

    datetimeFields.forEach((k) => {
      const val = copy[k];
      if (val === "") {
        copy[k] = null as any;
      } else if (val) {
        copy[k] = moment(val as any, "MMM D YYYY h:mm A").toISOString() as any;
      }
    });

    timeFields.forEach((k) => {
      const val = copy[k];
      if (val === "") {
        copy[k] = null as any;
      } else if (val) {
        copy[k] = moment(val as any, "h:mm A").format("HH:mm:ss") as any;
      }
    });
    return copy;
    // cleanObject(copy as Record<string, any>) as T;
  };

  const [details, setDetails] = useState<T>(() =>
    item ? transformFrom(item as T) : ({} as T)
  );
  const [msg, setMsg] = useState<Object>();
  const [isLoading, setLoading] = useState(false);

  const onPressCreate = async () => {
    setLoading(true);
    const resp = await store.addItem(transformTo(details));
    setLoading(false);
    if (!resp.ok) return setMsg(resp.details);
    fetchFcn?.();
    setVisible?.(false);
  };

  const onPressCreateAdd = async () => {
    setLoading(true);
    const resp = await store.addItem(transformTo(details));
    setLoading(false);
    if (!resp.ok) return setMsg(resp.details);
    fetchFcn?.();
    setDetails(transformFrom({} as T));
  };

  const onPressEdit = async () => {
    if (!item?.id) return;
    setLoading(true);
    const resp = await store.updateItem(item.id, transformTo(details));
    setLoading(false);
    if (!resp.ok) return setMsg(resp.details);
    fetchFcn?.();
    setVisible?.(false);
  };

  const onPressDelete = async () => {
    if (!item?.id) return;
    setLoading(true);
    const resp = await store.deleteItem(item.id);
    setLoading(false);
    if (!resp.ok) return setMsg(resp.details);
    fetchFcn?.();
    setVisible?.(false);
  };

  return (
    <View style={{ alignItems: "center" }}>
      <MyForm
        fields={fields}
        title={title}
        details={details}
        setDetails={setDetails}
        onPressSubmit={item?.id ? onPressEdit : onPressCreate}
        onPressSubmitAdd={onPressCreateAdd}
        hasDelete={!!item?.id}
        onDelete={onPressDelete}
        msg={msg}
        isLoading={isLoading}
        hasNoAdd
      />
    </View>
  );
}
