import { shallowMount } from "@vue/test-utils";
// @ts-ignore
import ContactList from "src/components/ContactList.vue";
describe("HelloWorld.vue", () => {
    it("renders props.msg when passed", () => {
        const msg = "new message";
        const wrapper = shallowMount(ContactList, {
            propsData: { msg },
        });
        expect(wrapper.text()).toMatch(msg);
    });
});
//# sourceMappingURL=example.spec.js.map