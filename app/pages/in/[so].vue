<script setup lang="ts">
import { item } from '~/data/catalog'
import { headOf, person } from '~/data/people'
import { docSo, fd, nf } from '~/utils/format'

/** Chứng từ xuất kho, A4, laid out like the paper form in QĐ 651 */
definePageMeta({ layout: 'print' })

const route = useRoute()
const so = String(route.params.so)
const { findSlip } = useStore()
const slip = computed(() => findSlip(so))
useHead({ title: `Chứng từ ${so}` })

const issuedAt = computed(() => slip.value?.events.find(e => e.kind === 'cap-phat')?.at ?? slip.value?.at ?? '')
const rows = computed(() => (slip.value?.lines ?? []).flatMap(l => (l.picks?.length ? l.picks : [{ so: '—', sl: l.sl }]).map(p => ({ it: item(l.ma), lot: p.so, sl: p.sl }))))
const total = computed(() => rows.value.reduce((a, r) => a + r.sl * r.it.gia, 0))
const print = () => window.print()
</script>

<template>
  <div v-if="slip">
    <div class="no-print mx-auto mb-4 flex max-w-[210mm] items-center justify-between gap-3">
      <UButton :to="`/phieu/${so}`" icon="i-lucide-chevron-left" label="Về phiếu" color="neutral" variant="ghost" />
      <UButton label="In chứng từ" icon="i-lucide-printer" @click="print" />
    </div>

    <article class="mx-auto min-h-[297mm] max-w-[210mm] bg-white px-[16mm] py-[14mm] text-[12.5px]/[1.5] text-black shadow-float print:min-h-0 print:shadow-none" style="font-family: 'Be Vietnam Pro', Arial, sans-serif">
      <header class="flex justify-between gap-6 text-center">
        <div>
          <p>SỞ Y TẾ TP. HỒ CHÍ MINH</p>
          <p class="font-bold">
            BỆNH VIỆN QUẬN PHÚ NHUẬN
          </p>
          <p class="mt-1">
            Khoa Dược – P.VTTBYT
          </p>
        </div>
        <div>
          <p class="font-bold">
            CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
          </p>
          <p class="font-semibold">
            Độc lập – Tự do – Hạnh phúc
          </p>
        </div>
      </header>

      <h1 class="mt-8 text-center text-[19px] font-bold tracking-wide">
        CHỨNG TỪ XUẤT KHO
      </h1>
      <p class="text-center">
        Số: <b class="tabular">{{ so }}</b>, ngày {{ fd(issuedAt) }}
      </p>

      <dl class="mt-6 grid grid-cols-[9rem_1fr] gap-y-1">
        <dt>Đơn vị lĩnh:</dt><dd class="font-semibold">
          {{ slip.khoa }}
        </dd>
        <dt>Người lập phiếu:</dt><dd>{{ person(slip.by).name }}</dd>
        <dt>Xuất tại:</dt><dd>{{ slip.kho }}</dd>
        <dt>Lý do xuất:</dt><dd>{{ slip.note ?? 'Cấp phát theo phiếu lĩnh' }}</dd>
      </dl>

      <table class="mt-5 w-full border-collapse">
        <thead>
          <tr>
            <th v-for="h in ['STT', 'Mã hàng', 'Tên vật tư', 'ĐVT', 'Số lô', 'Số lượng', 'Đơn giá', 'Thành tiền']" :key="h" class="border border-black px-1.5 py-1 font-semibold">
              {{ h }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(r, i) in rows" :key="i">
            <td class="border border-black px-1.5 py-1 text-center">
              {{ i + 1 }}
            </td>
            <td class="border border-black px-1.5 py-1">
              {{ r.it.ma }}
            </td>
            <td class="border border-black px-1.5 py-1">
              {{ r.it.ten }}
            </td>
            <td class="border border-black px-1.5 py-1 text-center">
              {{ r.it.dvt }}
            </td>
            <td class="border border-black px-1.5 py-1 text-center tabular">
              {{ r.lot }}
            </td>
            <td class="border border-black px-1.5 py-1 text-right tabular">
              {{ nf(r.sl) }}
            </td>
            <td class="border border-black px-1.5 py-1 text-right tabular">
              {{ nf(r.it.gia) }}
            </td>
            <td class="border border-black px-1.5 py-1 text-right tabular">
              {{ nf(r.sl * r.it.gia) }}
            </td>
          </tr>
          <tr>
            <td colspan="7" class="border border-black px-1.5 py-1 text-right font-bold">
              Tổng cộng
            </td>
            <td class="border border-black px-1.5 py-1 text-right font-bold tabular">
              {{ nf(total) }}
            </td>
          </tr>
        </tbody>
      </table>
      <p class="mt-2">
        Tổng số tiền bằng chữ: <i>{{ docSo(total) }}.</i>
      </p>

      <div class="mt-10 grid grid-cols-3 text-center">
        <div v-for="s in [['Người phát', person('hung').name], ['Người lĩnh', person(slip.by).name], ['Trưởng khoa', headOf(slip.khoa).name]]" :key="s[0]">
          <p class="font-bold">
            {{ s[0] }}
          </p>
          <p class="italic">
            (Ký, ghi rõ họ tên)
          </p>
          <p class="mt-16">
            {{ s[1] }}
          </p>
        </div>
      </div>
    </article>
  </div>
  <UiEmpty v-else icon="i-lucide-file-question" :title="`Không tìm thấy ${so}`" />
</template>
