<template>
    <div class="h-fit w-full p-8 rounded-lg bg-white shadow-[0px_0px_10px_rgba(0,0,0,0.1)]">
        <div class="text-xl font-semibold text-zinc-900 w-full rounded-t-xl bg-zinc-50 mb-10">
            Thông tin bán hàng
        </div>
        <div class="flex w-full">
            <div class="w-48 mr-6 mt-2 h-full flex justify-end text-sm text-zinc-900">
                Phân loại hàng
            </div>
            <div class="flex-1">
                <div
                    v-for="(category, index) in props.sanPham.phanLoai_SP"
                    :key="index"
                    class="w-full h-fit bg-zinc-100 p-5 rounded-md mb-5 relative"
                >
                    <div class="w-full h-fit flex">
                        <span class="mr-4 w-20 text-sm text-zinc-900 whitespace-break-spaces"
                            >Tên phân loại</span
                        >
                        <div class="w-1/2 relative">
                            <input
                                placeholder="Tên"
                                required
                                v-model="category.ten_PL"
                                maxlength="14"
                                class="border-[1px] border-zinc-300 focus:border-zinc-400 pl-3 pr-15 w-full h-10 rounded bg-zinc-50 outline-none text-sm text-zinc-900"
                            />
                            <div class="absolute right-0 top-0 w-fit h-10 flex items-center">
                                <div class="h-6 w-[1px] bg-zinc-300"></div>
                                <span class="w-fit text-center text-sm mx-3 text-zinc-400"
                                    >{{ category.ten_PL.length }}/14</span
                                >
                            </div>
                        </div>
                    </div>
                    <p
                        v-if="validateField(props.sanPham.phanLoai_SP[index].ten_PL) != true"
                        class="pl-26 text-xs text-red-400 pt-2 mb-5"
                    >
                        {{ validateField(props.sanPham.phanLoai_SP[index].ten_PL) }}
                    </p>
                    <div class="w-full h-fit flex mt-5">
                        <span class="mr-4 w-20 text-sm text-zinc-900">Tùy chọn</span>
                        <div class="flex-1 h-fit">
                            <div class="w-full h-fit grid grid-cols-2 gap-x-4 gap-y-2 mb-2">
                                <div
                                    class="mb-2"
                                    v-for="(option, optIndex) in category.tuyChon_PL"
                                    :key="optIndex"
                                >
                                    <div class="flex items-center">
                                        <div class="relative flex-1">
                                            <input
                                                v-model="option.ten_TC"
                                                placeholder="Tên tùy chọn"
                                                required
                                                maxlength="20"
                                                class="border-[1px] pl-3 pr-15 w-full h-10 rounded border-zinc-300 focus:border-zinc-400 bg-zinc-50 outline-none text-sm text-zinc-900"
                                            />
                                            <div
                                                class="absolute right-0 top-0 w-fit h-10 flex items-center"
                                            >
                                                <div class="h-6 w-[1px] bg-zinc-300"></div>
                                                <span
                                                    class="w-fit text-center text-sm mx-3 text-zinc-400"
                                                    >{{ option.ten_TC.length }}/20</span
                                                >
                                            </div>
                                        </div>
                                        <div class="w-8 h-full">
                                            <div
                                                @click="removeOption(category, index, optIndex)"
                                                class="w-full h-full flex items-center justify-center cursor-pointer"
                                            >
                                                <Icon
                                                    name="material-symbols:delete-outline-rounded"
                                                    size="18"
                                                    class="text-zinc-400 hover:text-zinc-600 cursor-pointer"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <p
                                        v-if="
                                            validateField(
                                                props.sanPham.phanLoai_SP[index].tuyChon_PL[
                                                    optIndex
                                                ].ten_TC
                                            ) != true
                                        "
                                        class="pl-1 text-xs text-red-400 pt-2"
                                    >
                                        {{
                                            validateField(
                                                props.sanPham.phanLoai_SP[index].tuyChon_PL[
                                                    optIndex
                                                ].ten_TC
                                            )
                                        }}
                                    </p>
                                </div>
                            </div>
                            <div
                                @click="addOption(index)"
                                class="w-fit flex items-center border-[1px] border-dashed cursor-pointer hover:bg-emerald-100/30 border-zinc-400 hover:border-emerald-400 rounded-sm h-8 px-4"
                            >
                                <span class="text-xs text-emerald-400"> + Thêm tùy chọn </span>
                            </div>
                        </div>
                    </div>
                    <div class="absolute right-0 top-0 w-12 h-12 bg-transparent p-2">
                        <div
                            @click="removeCategory(index)"
                            class="w-full h-full flex justify-center items-center bg-zinc-100 hover:bg-zinc-50 cursor-pointer rounded-full"
                        >
                            <Icon
                                name="material-symbols:close-rounded"
                                size="22"
                                class="text-zinc-700"
                            />
                        </div>
                    </div>
                </div>
                <div
                    v-if="props.sanPham.phanLoai_SP.length < 2"
                    @click="addCategory"
                    class="w-fit flex items-center border-[1px] border-dashed cursor-pointer hover:bg-emerald-100/30 border-zinc-400 hover:border-emerald-400 rounded-md h-10 px-8"
                >
                    <span class="text-sm text-emerald-400">+ Thêm nhóm phân loại</span>
                </div>
            </div>
        </div>
        <div v-if="props.sanPham.phanLoai_SP.length > 0" class="flex w-full mt-5">
            <div class="w-48 mr-6 mt-2 h-full flex justify-end text-sm text-zinc-900">
                Danh sách phân loại hàng
            </div>
            <div class="flex-1 border border-zinc-300 rounded-md overflow-auto">
                <table class="w-full table-fixed">
                    <thead>
                        <tr class="bg-zinc-200">
                            <th class="border border-zinc-300 p-2 w-40 h-10 text-zinc-700">
                                {{ props.sanPham.phanLoai_SP[0]?.ten_PL || "Phân loại 1" }}
                            </th>
                            <th
                                v-if="props.sanPham.phanLoai_SP.length == 2"
                                class="border border-zinc-300 p-2 w-40 h-10 text-zinc-700"
                            >
                                {{ props.sanPham.phanLoai_SP[1]?.ten_PL || "Phân loại 2" }}
                            </th>
                            <th class="border border-zinc-300 p-2 w-40 h-10 text-zinc-700">
                                Giá bán (VNĐ)
                            </th>
                            <th class="border border-zinc-300 p-2 w-40 h-10 text-zinc-700">
                                Trọng lượng (g)
                            </th>
                            <th class="border border-zinc-300 p-2 w-40 h-10 text-zinc-700">
                                Kho hàng
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <template
                            v-for="(option1, index1) in props.sanPham.phanLoai_SP[0].tuyChon_PL"
                        >
                            <template v-if="props.sanPham.phanLoai_SP.length == 2">
                                <tr
                                    v-for="(option2, index2) in props.sanPham.phanLoai_SP[1]
                                        .tuyChon_PL"
                                    :key="index1 + '-' + index2"
                                >
                                    <td
                                        v-if="index2 === 0"
                                        :rowspan="props.sanPham.phanLoai_SP[1].tuyChon_PL.length"
                                        class="border border-zinc-300 p-2 text-center align-middle"
                                    >
                                        {{ option1.ten_TC }}
                                    </td>
                                    <td class="p-2 text-center border border-zinc-300">
                                        {{ option2.ten_TC }}
                                    </td>
                                    <td class="border border-zinc-300 p-2 align-top">
                                        <div class="w-full h-full relative">
                                            <span
                                                class="absolute top-1/2 -translate-y-1/2 left-3 h-6 border-r-[1px] border-zinc-300 pr-2 text-zinc-300"
                                                >đ</span
                                            >
                                            <input
                                                type="number"
                                                v-model="
                                                    props.sanPham.ttBanHang_SP[
                                                        findSalesItemIndex(index1, index2)
                                                    ].giaBan_BH
                                                "
                                                class="w-full text-zinc-700 relative text-left h-10 outline-none pr-3 pl-9 focus:border-zinc-400 border-[1px] border-zinc-300 hover:border-zinc-400 rounded-md"
                                                placeholder="Nhập vào"
                                            />
                                        </div>
                                        <p
                                            v-if="
                                                validateField(
                                                    props.sanPham.ttBanHang_SP[
                                                        findSalesItemIndex(index1, index2)
                                                    ].giaBan_BH,
                                                    'giaBan_BH'
                                                ) != true
                                            "
                                            class="pl-1 text-xs text-red-400 pt-2"
                                        >
                                            {{
                                                validateField(
                                                    props.sanPham.ttBanHang_SP[
                                                        findSalesItemIndex(index1, index2)
                                                    ].giaBan_BH,
                                                    "giaBan_BH"
                                                )
                                            }}
                                        </p>
                                    </td>
                                    <td class="border border-zinc-300 p-2 align-top">
                                        <div class="w-full h-full relative">
                                            <span
                                                class="absolute top-1/2 -translate-y-1/2 left-3 h-6 border-r-[1px] border-zinc-300 pr-1 text-zinc-300"
                                                >gr</span
                                            >
                                            <input
                                                type="number"
                                                v-model="
                                                    props.sanPham.ttBanHang_SP[
                                                        findSalesItemIndex(index1, index2)
                                                    ].trongLuong_BH
                                                "
                                                class="w-full text-zinc-700 relative text-left h-10 outline-none pr-3 pl-9 focus:border-zinc-400 border-[1px] border-zinc-300 hover:border-zinc-400 rounded-md"
                                                placeholder="Nhập vào"
                                            />
                                        </div>
                                        <p
                                            v-if="
                                                validateField(
                                                    props.sanPham.ttBanHang_SP[
                                                        findSalesItemIndex(index1, index2)
                                                    ].trongLuong_BH,
                                                    'trongLuong_BH'
                                                ) != true
                                            "
                                            class="pl-1 text-xs text-red-400 pt-2"
                                        >
                                            {{
                                                validateField(
                                                    props.sanPham.ttBanHang_SP[
                                                        findSalesItemIndex(index1, index2)
                                                    ].trongLuong_BH,
                                                    "trongLuong_BH"
                                                )
                                            }}
                                        </p>
                                    </td>
                                    <td class="border border-zinc-300 p-2 align-top">
                                        <input
                                            type="number"
                                            v-model="
                                                props.sanPham.ttBanHang_SP[
                                                    findSalesItemIndex(index1, index2)
                                                ].khoHang_BH
                                            "
                                            class="w-full text-zinc-700 relative text-left h-10 outline-none p-3 focus:border-zinc-400 border-[1px] border-zinc-300 hover:border-zinc-400 rounded-md"
                                            placeholder="0"
                                        />
                                        <p
                                            v-if="
                                                validateField(
                                                    props.sanPham.ttBanHang_SP[
                                                        findSalesItemIndex(index1, index2)
                                                    ].khoHang_BH,
                                                    'khoHang_BH'
                                                ) != true
                                            "
                                            class="pl-1 text-xs text-red-400 pt-2"
                                        >
                                            {{
                                                validateField(
                                                    props.sanPham.ttBanHang_SP[
                                                        findSalesItemIndex(index1, index2)
                                                    ].khoHang_BH,
                                                    "khoHang_BH"
                                                )
                                            }}
                                        </p>
                                    </td>
                                </tr>
                            </template>

                            <tr v-else :key="index1">
                                <td class="border border-zinc-300 p-2 text-center">
                                    {{ option1.ten_TC }}
                                </td>
                                <td class="border border-zinc-300 p-2 align-top">
                                    <div class="w-full h-full relative">
                                        <span
                                            class="absolute top-1/2 -translate-y-1/2 left-3 h-6 border-r-[1px] border-zinc-300 pr-2 text-zinc-300"
                                            >đ</span
                                        >
                                        <input
                                            type="number"
                                            v-model="
                                                props.sanPham.ttBanHang_SP[
                                                    findSalesItemIndex(index1)
                                                ].giaBan_BH
                                            "
                                            class="w-full relative text-zinc-700 text-left h-10 outline-none pr-3 pl-9 focus:border-zinc-400 border-[1px] border-zinc-300 hover:border-zinc-400 rounded-md"
                                            placeholder="Nhập vào"
                                        />
                                    </div>
                                    <p
                                        v-if="
                                            validateField(
                                                props.sanPham.ttBanHang_SP[
                                                    findSalesItemIndex(index1, index2)
                                                ].giaBan_BH,
                                                'giaBan_BH'
                                            ) != true
                                        "
                                        class="pl-1 text-xs text-red-400 pt-2"
                                    >
                                        {{
                                            validateField(
                                                props.sanPham.ttBanHang_SP[
                                                    findSalesItemIndex(index1, index2)
                                                ].giaBan_BH,
                                                "giaBan_BH"
                                            )
                                        }}
                                    </p>
                                </td>
                                <td class="border border-zinc-300 p-2 align-top">
                                    <div class="w-full h-full relative">
                                        <span
                                            class="absolute top-1/2 -translate-y-1/2 left-3 h-6 border-r-[1px] border-zinc-300 pr-2 text-zinc-300"
                                            >gr</span
                                        >
                                        <input
                                            type="number"
                                            v-model="
                                                props.sanPham.ttBanHang_SP[
                                                    findSalesItemIndex(index1)
                                                ].trongLuong_BH
                                            "
                                            class="w-full relative text-zinc-700 text-left h-10 outline-none pr-3 pl-10 focus:border-zinc-400 border-[1px] border-zinc-300 hover:border-zinc-400 rounded-md"
                                            placeholder="Nhập vào"
                                        />
                                    </div>
                                    <p
                                        v-if="
                                            validateField(
                                                props.sanPham.ttBanHang_SP[
                                                    findSalesItemIndex(index1, index2)
                                                ].trongLuong_BH,
                                                'trongLuong_BH'
                                            ) != true
                                        "
                                        class="pl-1 text-xs text-red-400 pt-2"
                                    >
                                        {{
                                            validateField(
                                                props.sanPham.ttBanHang_SP[
                                                    findSalesItemIndex(index1, index2)
                                                ].trongLuong_BH,
                                                "trongLuong_BH"
                                            )
                                        }}
                                    </p>
                                </td>
                                <td class="border border-zinc-300 p-2 align-top">
                                    <input
                                        type="number"
                                        v-model="
                                            props.sanPham.ttBanHang_SP[findSalesItemIndex(index1)]
                                                .khoHang_BH
                                        "
                                        class="w-full text-zinc-700 relative text-left h-10 outline-none p-3 focus:border-zinc-400 border-[1px] border-zinc-300 hover:border-zinc-400 rounded-md"
                                        placeholder="0"
                                    />
                                    <p
                                        v-if="
                                            validateField(
                                                props.sanPham.ttBanHang_SP[
                                                    findSalesItemIndex(index1, index2)
                                                ].khoHang_BH,
                                                'khoHang_BH'
                                            ) != true
                                        "
                                        class="pl-1 text-xs text-red-400 pt-2"
                                    >
                                        {{
                                            validateField(
                                                props.sanPham.ttBanHang_SP[
                                                    findSalesItemIndex(index1, index2)
                                                ].khoHang_BH,
                                                "khoHang_BH"
                                            )
                                        }}
                                    </p>
                                </td>
                            </tr>
                        </template>
                    </tbody>
                </table>
            </div>
        </div>
        <div v-else>
            <div class="flex items-center mt-5">
                <div class="w-48 mr-6 flex justify-end text-sm text-zinc-900">
                    <span class="text-red-400 mr-1">*</span>
                    Giá bán
                </div>
                <div class="relative flex-1 grid grid-cols-2 gap-6">
                    <span
                        class="absolute top-1/2 -translate-y-1/2 left-4 h-6 border-r-[1px] border-zinc-300 pr-2 text-zinc-300"
                        >đ</span
                    >
                    <input
                        type="number"
                        v-model="props.sanPham.ttBanHang_SP[0].giaBan_BH"
                        class="w-full text-zinc-700 relative text-left h-10 outline-none pr-3 pl-10 border-[1px] border-zinc-300 hover:border-zinc-400 focus:border-zinc-400 rounded-md"
                        placeholder="Nhập vào"
                    />
                </div>
            </div>
            <p
                v-if="validateField(props.sanPham.ttBanHang_SP[0].giaBan_BH, 'giaBan_BH') != true"
                class="pl-56 text-xs text-red-400 pt-2"
            >
                {{ validateField(props.sanPham.ttBanHang_SP[0].giaBan_BH, "giaBan_BH") }}
            </p>
            <div class="flex items-center mt-5">
                <div class="w-48 mr-6 flex justify-end text-sm text-zinc-900">
                    <span class="text-red-400 mr-1">*</span>
                    Trọng lượng
                </div>
                <div class="relative flex-1 grid grid-cols-2 gap-6">
                    <span
                        class="absolute top-1/2 -translate-y-1/2 left-4 h-6 border-r-[1px] pr-2 text-zinc-300"
                        >gr</span
                    >
                    <input
                        type="number"
                        v-model="props.sanPham.ttBanHang_SP[0].trongLuong_BH"
                        class="w-full text-zinc-700 relative text-left h-10 outline-none pr-3 pl-11 border-[1px] border-zinc-300 hover:border-zinc-400 focus:border-zinc-400 rounded-md"
                        placeholder="Nhập vào"
                    />
                </div>
            </div>
            <p
                v-if="
                    validateField(props.sanPham.ttBanHang_SP[0].trongLuong_BH, 'trongLuong_BH') !=
                    true
                "
                class="pl-56 text-xs text-red-400 pt-2"
            >
                {{ validateField(props.sanPham.ttBanHang_SP[0].trongLuong_BH, "trongLuong_BH") }}
            </p>
            <div class="flex items-center mt-5">
                <div class="w-48 mr-6 flex justify-end text-sm text-zinc-900">
                    <span class="text-red-400 mr-1">*</span>
                    Kho hàng
                </div>
                <div class="relative flex-1 grid grid-cols-2 gap-6">
                    <input
                        type="number"
                        v-model="props.sanPham.ttBanHang_SP[0].khoHang_BH"
                        class="w-full text-zinc-700 relative text-left h-10 outline-none p-3 border-[1px] border-zinc-300 hover:border-zinc-400 focus:border-zinc-400 rounded-md"
                        placeholder="0"
                    />
                </div>
            </div>
            <p
                v-if="validateField(props.sanPham.ttBanHang_SP[0].khoHang_BH, 'khoHang_BH') != true"
                class="pl-56 text-xs text-red-400 pt-2"
            >
                {{ validateField(props.sanPham.ttBanHang_SP[0].khoHang_BH, "khoHang_BH") }}
            </p>
        </div>
    </div>
</template>
<script setup>
import { reactive, onBeforeMount } from "vue";
const props = defineProps(["sanPham"]);

const addCategory = () => {
    if (props.sanPham.phanLoai_SP.length < 2) {
        props.sanPham.phanLoai_SP.push({ ten_PL: "", tuyChon_PL: [] });
        props.sanPham.ttBanHang_SP = generateSalesList();
    }
};

const removeCategory = (index) => {
    props.sanPham.phanLoai_SP.splice(index, 1);
    props.sanPham.ttBanHang_SP = generateSalesList();
};

const addOption = (index) => {
    props.sanPham.phanLoai_SP[index].tuyChon_PL.push({ ten_TC: "" });
    const newIndex = props.sanPham.phanLoai_SP[index].tuyChon_PL.length - 1;
    addSalesItem(newIndex, index);
};

const removeOption = (category, catIndex, optIndex) => {
    removeSalesItem(optIndex, catIndex);
    category.tuyChon_PL.splice(optIndex, 1);
};

const generateSalesList = () => {
    const salesList = [];

    if (props.sanPham.phanLoai_SP.length === 2) {
        props.sanPham.phanLoai_SP[0].tuyChon_PL.forEach((option1, index1) => {
            props.sanPham.phanLoai_SP[1].tuyChon_PL.forEach((option2, index2) => {
                salesList.push({
                    tuyChonPhanLoai1_BH: index1,
                    tuyChonPhanLoai2_BH: index2,
                    giaBan_BH: null,
                    trongLuong_BH: null,
                    khoHang_BH: null,
                });
            });
        });
    } else if (props.sanPham.phanLoai_SP.length === 1) {
        props.sanPham.phanLoai_SP[0].tuyChon_PL.forEach((option1, index1) => {
            salesList.push({
                tuyChonPhanLoai1_BH: index1,
                tuyChonPhanLoai2_BH: null,
                giaBan_BH: null,
                trongLuong_BH: null,
                khoHang_BH: null,
            });
        });
    } else {
        salesList.push({
            tuyChonPhanLoai1_BH: null,
            tuyChonPhanLoai2_BH: null,
            giaBan_BH: null,
            trongLuong_BH: null,
            khoHang_BH: null,
        });
    }

    return salesList;
};

const addSalesItem = (newIndex, index) => {
    if (props.sanPham.phanLoai_SP.length === 2) {
        if (index === 0) {
            // Thêm tùy chọn vào phân loại 1 → Duyệt qua tất cả tùy chọn của phân loại 2
            props.sanPham.phanLoai_SP[1].tuyChon_PL.forEach((option2, index2) => {
                props.sanPham.ttBanHang_SP.push({
                    tuyChonPhanLoai1_BH: newIndex,
                    tuyChonPhanLoai2_BH: index2,
                    giaBan_BH: null,
                    trongLuong_BH: null,
                    khoHang_BH: null,
                });
            });
        } else if (index === 1) {
            // Thêm vào phân loại 2 → Duyệt qua tất cả tùy chọn của phân loại 1
            props.sanPham.phanLoai_SP[0].tuyChon_PL.forEach((option1, index1) => {
                props.sanPham.ttBanHang_SP.push({
                    tuyChonPhanLoai1_BH: index1,
                    tuyChonPhanLoai2_BH: newIndex,
                    giaBan_BH: null,
                    trongLuong_BH: null,
                    khoHang_BH: null,
                });
            });
        }
    } else {
        // Trường hợp chỉ có 1 phân loại
        props.sanPham.ttBanHang_SP.push({
            tuyChonPhanLoai1_BH: newIndex,
            tuyChonPhanLoai2_BH: null,
            giaBan_BH: null,
            trongLuong_BH: null,
            khoHang_BH: null,
        });
    }
};

const removeSalesItem = (optIndex, index) => {
    if (props.sanPham.phanLoai_SP.length === 2) {
        if (index === 0) {
            // Xóa tất cả sản phẩm có tùy chọn phân loại 1 trùng với optionToRemove
            props.sanPham.ttBanHang_SP = props.sanPham.ttBanHang_SP.filter(
                (item) => item.tuyChonPhanLoai1_BH !== optIndex
            );
            props.sanPham.ttBanHang_SP.forEach((item) => {
                if (item.tuyChonPhanLoai1_BH > optIndex) {
                    item.tuyChonPhanLoai1_BH--;
                }
            });
        } else if (index === 1) {
            // Xóa tất cả sản phẩm có tùy chọn phân loại 2 trùng với optionToRemove
            props.sanPham.ttBanHang_SP = props.sanPham.ttBanHang_SP.filter(
                (item) => item.tuyChonPhanLoai2_BH !== optIndex
            );

            props.sanPham.ttBanHang_SP.forEach((item) => {
                if (item.tuyChonPhanLoai2_BH > optIndex) {
                    item.tuyChonPhanLoai2_BH--;
                }
            });
        }
    } else {
        // Nếu chỉ có một phân loại → Xóa tất cả sản phẩm có tùy chọn phân loại 1 trùng với optionToRemove
        props.sanPham.ttBanHang_SP = props.sanPham.ttBanHang_SP.filter(
            (item) => item.tuyChonPhanLoai1_BH !== optIndex
        );
        props.sanPham.ttBanHang_SP.forEach((item) => {
            if (item.tuyChonPhanLoai1_BH > optIndex) {
                item.tuyChonPhanLoai1_BH--;
            }
        });
    }
};

const findSalesItemIndex = (index1, index2) => {
    const result = props.sanPham.ttBanHang_SP.findIndex(
        (item) =>
            item.tuyChonPhanLoai1_BH == (index1 ?? null) &&
            item.tuyChonPhanLoai2_BH == (index2 ?? null)
    );
    return result;
};

onBeforeMount(() => {
    if (props.sanPham.ttBanHang_SP.length === 0) {
        props.sanPham.ttBanHang_SP = generateSalesList();
    }
});

// Kiểm tra giá trị hợp lệ
const validateField = (value, fieldType) => {
    if (value === "" || value === null || value === undefined) return "Không được để trống ô";
    if (fieldType === "giaBan_BH" && (value < 1000 || value > 120000000))
        return "Giá từ 1.000 - 120.000.000";
    if (fieldType === "trongLuong_BH" && (value <= 0 || value > 1000000))
        return "Trọng lượng từ 0 - 1.000.000";
    if (fieldType === "khoHang_BH" && (value < 0 || value > 10000000))
        return "Kho hàng tối đa 10.000.000";
    return true;
};

// Hàm kiểm tra dữ liệu toàn bộ
const validateForm = () => {
    // Kiểm tra phân loại sản phẩm
    for (const category of props.sanPham.phanLoai_SP) {
        if (!category.ten_PL) return false;

        // Kiểm tra trùng tên phân loại
        if (props.sanPham.phanLoai_SP.filter((c) => c.ten_PL === category.ten_PL).length === 0)
            return false;

        let nameSet = new Set();
        for (const option of category.tuyChon_PL) {
            if (!option.ten_TC || option.ten_TC.length === 0 || nameSet.has(option.ten_TC))
                return false;
            nameSet.add(option.ten_TC);
        }
    }

    // Kiểm tra thông tin bán hàng
    for (const item of props.sanPham.ttBanHang_SP) {
        if (
            validateField(item.giaBan_BH, "giaBan_BH") !== true ||
            validateField(item.trongLuong_BH, "trongLuong_BH") !== true ||
            validateField(item.khoHang_BH, "khoHang_BH") !== true
        ) {
            return false;
        }
    }
    return true;
};

defineExpose({ validateForm });
</script>

<style scoped>
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

/* Ẩn nút tăng giảm trên Firefox */
input[type="number"] {
    -moz-appearance: textfield;
}
</style>
