import getPrintifyData from "./adapters/printifyAdapter";

export default async function router(store) {
    //return all data in normalized fashion regardless of POD provider
    let apiData;
    switch (store) {
        case "printify":
            return await getPrintifyData();
    }
}