import { Router } from 'express';
import { getRecentLedgers, LedgerParams} from './bigmaps';
import { getRecentBigTransactions } from './operations';
export const router: Router = Router();

router.post("/recent/ledgers", async (req, res) => {
  try {
    const params: LedgerParams = req.body
    res.status(200).send(await getRecentLedgers(params));
  } catch (error) {
    console.log(error)
    res.status(500).send(error);
  }
});

router.get('/recent/bigfish', async (req, res) => {
  try {
    res.status(200).send(await getRecentBigTransactions());
  } catch (error) {
    console.log(error)
    res.status(500).send(error);
  }
});
